# Mieszkanie na żywo · Home Assistant

Mieszkanie pokazuje dom jako izometryczną makietę. Pokoje reagują na światła i porę dnia, znaczniki pokazują stany czujników, a widok energii rysuje przepływ prądu do pracujących urządzeń. Kliknięcie pomieszczenia przybliża je i otwiera jego sterowanie.

To darmowa wersja społecznościowa Krystal Twin. Zawiera przykładową makietę z trzema wariantami oświetlenia oraz konfigurację z przykładowymi encjami.

![Mieszkanie w trybie demonstracyjnym](docs/mieszkanie-demo.png)

Na telefonie tryby widoku są bezpośrednio pod makietą, a niżej jest dziesięć kafli ze zdjęciami, w tym Kocia strefa i Drukarka 3D.

## Instalacja przez HACS

1. W **HACS → ⋮ → Niestandardowe repozytoria** dodaj `https://github.com/krystianokris/mieszkanie-ha` w kategorii **Integracja**.
2. Pobierz **Mieszkanie na żywo**, a następnie uruchom ponownie Home Assistant.
3. W **Ustawienia → Urządzenia i usługi → Dodaj integrację** wybierz **Krystal Twin (Mieszkanie na żywo)**.
4. Na pasku bocznym pojawią się **Mieszkanie** i **Pokoje Mieszkanie**. W Pokojach jest też **Kocia strefa**, dostępna z kafla i ze skrótu w Gabinecie.

HACS pobiera pliki. Integracja rejestruje oba panele oraz ładuje dołączone karty i grafiki. Jeżeli adres `mieszkanie-pokoje` jest już używany przez Twój dashboard, integracja korzysta z istniejącego adresu.

## Instalacja ręczna

Pobierz [ZIP repozytorium](https://github.com/krystianokris/mieszkanie-ha/archive/refs/heads/main.zip) i skopiuj katalog `custom_components/krystal_twin` do `custom_components` w konfiguracji HA. Uruchom ponownie HA i dodaj integrację jak w kroku 3.

## Przypisz własne encje

Przy pierwszym uruchomieniu powstają `config/krystal_twin/layout.json` i `config/krystal_twin/pokoje-mieszkanie.json`. Podmień identyfikatory `*.demo_*` na własne z **Narzędzia deweloperskie → Stany**. W obu plikach ten sam identyfikator przykładowy oznacza to samo urządzenie. Na początek wystarczy jedno pomieszczenie. Po zapisaniu przeładuj integrację i odśwież HA.

Jeśli aktualizujesz wydanie 0.1.0 z własną konfiguracją, zachowaj kopię dotychczasowego `layout.json` przed pobraniem aktualizacji i wstaw ją do `config/krystal_twin/`. Własne konfiguracje w tym katalogu pozostają przy aktualizacjach HACS.

## Dopasowanie do swojego domu

- `layout.json` zawiera przypisania urządzeń, skróty sterowania, nazwy i encje podsumowania. Powtarzające się identyfikatory zastąp konsekwentnie w całym pliku.
- `frontend/twin/` w katalogu integracji zawiera rendery `day.webp`, `night.webp` i `lit.webp`. Własne obrazy powinny mieć ten sam kadr i proporcje 16:9.
- Jeśli układ pokoi się różni, zmień obrysy i punkty urządzeń w `frontend/src/twin/scene.json` w źródłach. Same obrazy nie przesuwają znaczników.
- W pakiecie jest też osobny dashboard **Pokoje Mieszkanie** z Pomieszczeniami i Kocią strefą.

## Budowanie

Gotowy panel jest w katalogu integracji. Do przebudowania źródeł użyj Bun:

```sh
cd frontend
bun install --frozen-lockfile
bun run build
```

Następnie przeładuj integrację w HA. Zasoby grafiki są opisane w [ART-NOTICE.md](ART-NOTICE.md).

## Podziel się swoją wersją

Jeśli zrobisz własną wersję makiety, wrzuć zrzut albo opisz zmiany w Issues. W zgłoszeniu błędu podaj wersję HA i przeglądarkę. Przed dołączeniem własnego `layout.json` usuń z niego prywatne dane.
