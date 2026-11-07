"""Krystal Twin: the home as a live isometric 3D model, as a Home Assistant panel."""

from __future__ import annotations

import hashlib
import json
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from .const import (
    DATA_STATIC_REGISTERED,
    DOMAIN,
    FRONTEND_DIR,
    FRONTEND_LAYOUT,
    FRONTEND_MODULE,
    PANEL_ELEMENT,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    STATIC_URL_BASE,
)

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

FRONTEND_PATH = Path(__file__).parent / FRONTEND_DIR
ROOMS_PATH = 'mieszkanie-pokoje'
ROOMS_OWNER = 'rooms_entry_id'


def _read_config(directory: Path, filename: str) -> dict:
    directory.mkdir(parents=True, exist_ok=True)
    file = directory / filename
    if not file.exists():
        try:
            with file.open('xb') as output:
                output.write((FRONTEND_PATH / filename).read_bytes())
        except FileExistsError:
            pass
    data = json.loads(file.read_text(encoding='utf-8'))
    if not isinstance(data, dict):
        raise ValueError(f'{file} must contain a JSON object')
    return data


def _file_hash(path: Path) -> str | None:
    """Short content hash used to bust browser caches; None if the file is missing."""
    try:
        return hashlib.sha1(path.read_bytes()).hexdigest()[:10]
    except OSError:
        return None


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Krystal Twin domain."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def _async_register_static(hass: HomeAssistant) -> None:
    """Serve the prebuilt frontend bundle and renders (once; aiohttp routes cannot be removed)."""
    data = hass.data.setdefault(DOMAIN, {})
    if data.get(DATA_STATIC_REGISTERED):
        return
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL_BASE, str(FRONTEND_PATH), cache_headers=False)]
    )
    data[DATA_STATIC_REGISTERED] = True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Register the Mieszkanie sidebar panel."""
    await _async_register_static(hass)

    directory = Path(hass.config.path(DOMAIN))
    layout = await hass.async_add_executor_job(_read_config, directory, FRONTEND_LAYOUT)
    rooms = await hass.async_add_executor_job(_read_config, directory, 'pokoje-mieszkanie.json')
    if not isinstance(rooms.get('views'), list) or not rooms['views']:
        raise ValueError('pokoje-mieszkanie.json must contain at least one view')

    integration = await async_get_integration(hass, DOMAIN)
    version = str(integration.version or "dev")
    module_hash = await hass.async_add_executor_job(_file_hash, FRONTEND_PATH / FRONTEND_MODULE)
    layout_hash = await hass.async_add_executor_job(_file_hash, FRONTEND_PATH / FRONTEND_LAYOUT)
    build = module_hash or version

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=PANEL_ELEMENT,
        frontend_url_path=PANEL_URL_PATH,
        module_url=f"{STATIC_URL_BASE}/{FRONTEND_MODULE}?v={build}",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        require_admin=False,
        embed_iframe=False,
        config={"version": version, "build": build, "layout": layout_hash, "layoutData": layout},
    )
    if not frontend.async_panel_exists(hass, ROOMS_PATH):
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=ROOMS_PATH,
            webcomponent_name='krystal-twin-rooms',
            module_url=f'{STATIC_URL_BASE}/krystal-twin-rooms.js?v={version}',
            sidebar_title='Pokoje Mieszkanie',
            sidebar_icon='mdi:floor-plan',
            embed_iframe=False,
            config={'rooms': rooms},
        )
        hass.data[DOMAIN][ROOMS_OWNER] = entry.entry_id
    _LOGGER.debug("Krystal Twin %s (build %s, layout %s) registered at /%s", version, build, layout_hash or "none", PANEL_URL_PATH)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the Mieszkanie sidebar panel."""
    if hass.data[DOMAIN].get(ROOMS_OWNER) == entry.entry_id:
        frontend.async_remove_panel(hass, ROOMS_PATH)
        hass.data[DOMAIN].pop(ROOMS_OWNER)
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    return True
