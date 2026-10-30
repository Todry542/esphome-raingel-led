# English

# ESPHome Raingel LED

ESPHome component to control via BLE the LED equipment that works with the **Raingel** app (DoHome, BLE name `VC-BLELIGHT` / `Light_xxxx`).

Features:
- RGB `light` entity (on/off, color, brightness)
- **RGB** (5 modes) and **Magic** (18 modes) effects with palettes, via a Home Assistant action
- Custom Lovelace card (optional) to control the effects

> The led controler does not return any state: the state displayed in HA is optimistic (the last state sent).

---

## Directory structure

```
raingeled.yaml
secrets.yaml                      # to create (see below)
external_components/
└── raingel/
    ├── __init__.py
    └── light/
        ├── __init__.py
        ├── raingel_light.cpp
        └── raingel_light.h
```

---

## Installation

### 1. Find the leds's MAC address
- Use **nRF Connect** on mobile.
- Look for a `VC-BLELIGHT` or `Light_xxxx` device.
- Note down the MAC address (`XX:XX:XX:XX:XX:XX`).

### 2. Configure WiFi
In `secrets.yaml`, fill in:

```yaml
wifi_ssid: "YOUR_SSID"
wifi_password: "YOUR_PASSWORD"
```

### 3. Configure the MAC address
Edit `raingeled.yaml` and replace:

```yaml
led_mac: "XX\:XX\:XX\:XX\:XX\:XX"  # <-- YOUR MAC
```

### 4. Flash
Place the `external_components` folder in the same directory as `raingeled.yaml` (see [external_components](https://esphome.io/components/external_components/)), then use the [ESPHome Device Builder](https://esphome.io/install/) to compile and flash `raingeled.yaml` to the ESP32 via USB.

> Close the Raingel app on your phone before testing: the leds controler only accepts one BLE client at a time.

---

## Home Assistant

### Add the ESPHome integration
Add the [ESPHome integration](https://www.home-assistant.io/integrations/esphome):

[![Add the ESPHome integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start?domain=esphome)

### Light entity
A `Raingel LED` entity appears automatically and lets you:
- Turn on / off;
- Set the RGB color;
- Adjust the brightness.

Its identifier depends on the device's name. Find it under **Settings → Tools → Entities**.

### Action for effects
The device exposes the `esphome.raingeled_set_effect` action (visible under **Developer tools → Actions**).
   Field | RGB (`is_magic: false`) | Magic (`is_magic: true`) |
 |---|---|---|
 | `mode_id` | 0 = static, 1 = Fade, 2 = Jump, 3 = Breathing, 4 = Flash | 1 to 18 |
 | `palette_index` | 0 to 29 | 0 to 18 |
 | `speed` | 0 to 100 | 0 to 100 |
 | `brightness` | 0 to 100 | 0 to 100 |

`mode_id: 0` in RGB returns the static color and brightness (back to the "no effect" state).

Example automation:

```yaml
alias: LED - effect at sunset
triggers:
  - trigger: sun
    event: sunset
actions:
  - action: light.turn_on
    target:
      entity_id: light.raingeled       # adjust to your entity
  - delay: "00:00:01"                  # let the turn-on command go through
  - action: esphome.raingeled_set_effect
    data:
      is_magic: false
      mode_id: 1                       # Fade
      palette_index: 29                # Rainbow 8
      speed: 50
      brightness: 80
```

> The sent effect cancels commands still pending: hence the `delay` after `light.turn_on`. If the leds is already on, these first two steps are unnecessary.

### Custom card (optional)
1. Copy `raingel-effect-card.js` into HA's `www` configuration folder (`/homeassistant/www/` on HA OS, `<config>/www/` elsewhere). Restart HA if the folder was just created.
2. Under **Settings → Dashboards → ⋮ → Resources**, add the URL `/local/raingel-effect-card.js` (type **JavaScript module**).
3. You can then add the card from the card picker, or in YAML:

```yaml
type: custom:raingel-effect-card
title: Raingel
entity_id: light.raingeled_raingel_led             # required: your light entity
#service: esphome.raingeled_set_effect              # default
```

The card lets you turn on/off, choose the type (RGB / Magic), the effect, the palette, the speed, and the brightness. Since the controler leds does not return its state, the "Effect" row shows the **last effect sent from the card** (stored in the browser).

---

## Files to modify
 | File | Modification |
 |---------|--------------|
 | `secrets.yaml` | SSID, WiFi password, access point password |
 | `raingeled.yaml` | Led's MAC address (`led_mac`) |
 | JS card (YAML config) | your light's `entity_id` |

---

## Troubleshooting

- **Connection failed / led not responding**: close the Raingel app on your phone (single BLE client).
- **Compilation failed**: check the ESPHome version (tested with 2026.8.0) and the components directory structure.
- **"Effect: None" on the card**: normal as long as no effect has been sent from the card; the controler's leds actual state cannot be read.
- **Card error `custom element doesn't exist`**: resource misdeclared or cache issue (Ctrl+F5).

---

## Credits

BLE protocol reverse-engineered by [Francesco149/lucente](https://github.com/Francesco149/lucente/blob/master/docs/protocols/raingel.md). Project not affiliated with Raingel / DoHome.

---

# Français

# ESPHome Raingel LED

Composant ESPHome pour contrôler par BLE les équipements LED qui fonctionnent avec l'application **Raingel** (DoHome, nom BLE `VC-BLELIGHT` / `Light_xxxx`).

Fonctionnalités :
- Entité `light` RGB (allumer/éteindre, couleur, luminosité)
- Effets **RGB** (5 modes) et **Magic** (18 modes) avec palettes, via une action Home Assistant
- Carte Lovelace personnalisée (optionnelle) pour piloter les effets

> Le controleurs leds ne renvoie aucun état : l'état affiché dans HA est optimiste (le dernier état envoyé).

---

## Arborescence

```
raingeled.yaml
secrets.yaml                      # à créer (voir ci-dessous)
external_components/
└── raingel/
    ├── __init__.py
    └── light/
        ├── __init__.py
        ├── raingel_light.cpp
        └── raingel_light.h
```

---

## Installation

### 1. Trouver l'adresse MAC des leds
- Utiliser **nRF Connect** sur mobile.
- Chercher un périphérique `VC-BLELIGHT` ou `Light_xxxx`.
- Noter l'adresse MAC (`XX:XX:XX:XX:XX:XX`).

### 2. Configurer le WiFi
Dans `secrets.yaml` remplir :

```yaml
wifi_ssid: "VOTRE_SSID"
wifi_password: "VOTRE_MOT_DE_PASSE"
```

### 3. Configurer l'adresse MAC
Éditer `raingeled.yaml` et remplacer :

```yaml
led_mac: "XX:XX:XX:XX:XX:XX"  # <-- VOTRE MAC
```

### 4. Flash
Placer le dossier `external_components` dans le même répertoire que `raingeled.yaml` (voir [external_components](https://esphome.io/components/external_components/)), puis utiliser l'[ESPHome Device Builder](https://esphome.io/install/) pour compiler et flasher `raingeled.yaml` sur l'ESP32 via USB.

> Fermer l'application Raingel sur le téléphone avant de tester : le controleur led n'accepte qu'un seul client BLE à la fois.

---

## Home Assistant

### Ajouter l'intégration ESPHome
Ajouter l'[intégration ESPHome](https://www.home-assistant.io/integrations/esphome) :

[![Ajouter l'intégration ESPHome](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start?domain=esphome)

### Entité lumière
Une entité `Raingel LED` apparaît automatiquement et permet de :
- Allumer / éteindre ;
- Régler la couleur RGB ;
- Ajuster la luminosité.

Son identifiant dépend du nom de l'appareil. Le retrouver dans **Paramètres → Appareils et services → Entités**.

### Action pour les effets
L'appareil expose l'action `esphome.raingeled_set_effect` (visible dans **Outils → Actions**). 

| Champ | RGB (`is_magic: false`) | Magic (`is_magic: true`) |
|---|---|---|
| `mode_id` | 0 = statique, 1 = Fondu, 2 = Saut, 3 = Respiration, 4 = Éclair | 1 à 18 |
| `palette_index` | 0 à 29 | 0 à 18 |
| `speed` | 0 à 100 | 0 à 100 |
| `brightness` | 0 à 100 | 0 à 100 |

`mode_id: 0` en RGB renvoie la couleur et la luminosité statiques (retour à l'état « sans effet »).

Exemple d'automatisation :

```yaml
alias: LED - effet au coucher du soleil
triggers:
  - trigger: sun
    event: sunset
actions:
  - action: light.turn_on
    target:
      entity_id: light.raingeled       # adapter à votre entité
  - delay: "00:00:01"                  # laisser partir la commande d'allumage
  - action: esphome.raingeled_set_effect
    data:
      is_magic: false
      mode_id: 1                       # Fondu
      palette_index: 29                # Arc-en-ciel 8
      speed: 50
      brightness: 80
```

> L'effet envoyé annule les commandes encore en attente : d'où le `delay` après `light.turn_on`. Si les leds sont déjà allumé, ces deux premières étapes sont inutiles.

### Carte personnalisée (optionnelle)
1. Copier `raingel-effect-card.js` dans le dossier `www` de la configuration HA (`/homeassistant/www/` sur HA OS, `<config>/www/` ailleurs). Redémarrer HA si le dossier vient d'être créé.
2. Dans **Paramètres → Tableaux de bord → ⋮ → Ressources**, ajouter l'URL `/local/raingel-effect-card.js` (type **Module JavaScript**).
3. Vous pouvez ensuite ajouter la carte depuis le sélecteur de cartes, ou en YAML :

```yaml
type: custom:raingel-effect-card
title: Raingel
entity_id: light.raingeled_raingel_led             # obligatoire : votre entité light
#service: esphome.raingeled_set_effect              # par défaut
```

La carte permet d'allumer/éteindre, de choisir le type (RGB / Magic), l'effet, la palette, la vitesse et la luminosité. Comme le controleur leds ne renvoie pas son état, la ligne « Effet » affiche le **dernier effet envoyé depuis la carte** (mémorisé dans le navigateur).

---

## Fichiers à modifier

| Fichier | Modification |
|---------|--------------|
| `secrets.yaml` | SSID, mot de passe WiFi, mot de passe du point d'accès |
| `raingeled.yaml` | Adresse MAC des leds (`led_mac`) |
| Carte JS (config YAML) | `entity_id` de votre lumière |

---

## Dépannage

- **Connexion échouée / les led ne répond pas** : fermer l'app Raingel sur le téléphone (un seul client BLE).
- **Compilation échouée** : vérifier la version d'ESPHome (testé avec 2026.8.0) et l'arborescence des composants.
- **« Effet : Aucun » sur la carte** : normal tant qu'aucun effet n'a été envoyé depuis la carte ; l'état réel des leds n'est pas lisible.
- **Carte en erreur `custom element doesn't exist`** : ressource mal déclarée ou cache (Ctrl+F5).

---

## Crédits

Protocole BLE rétro-ingénieré par [Francesco149/lucente](https://github.com/Francesco149/lucente/blob/master/docs/protocols/raingel.md). Projet non affilié à Raingel / DoHome.