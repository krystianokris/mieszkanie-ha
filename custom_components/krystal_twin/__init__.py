"""Krystal Twin: the home as a live isometric 3D model, as a Home Assistant panel."""

from __future__ import annotations

import hashlib
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
        config={"version": version, "build": build, "layout": layout_hash},
    )
    _LOGGER.debug("Krystal Twin %s (build %s, layout %s) registered at /%s", version, build, layout_hash or "none", PANEL_URL_PATH)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the Mieszkanie sidebar panel."""
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    return True
