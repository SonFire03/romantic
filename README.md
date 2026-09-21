# Une affaire de cœur 💗

Un site romantique, un peu absurde et entièrement statique. Il contient une enquête amoureuse, un love-o-mètre, des cartes interactives, un quiz, des bisous, un câlin, une timeline et une question finale avec deux vraies réponses possibles.

## Lancer le site

Ouvrez `index.html` dans un navigateur récent. Aucun compte, installation ou compilation n'est nécessaire. Pour le tester avec une adresse locale, lancez dans ce dossier :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000`. Le site fonctionne aussi sans serveur ; un serveur local facilite seulement les tests sur téléphone.

Pour le tunnel TryCloudflare installé sur cette machine, `serve.py` sert uniquement les fichiers publics du site sur `127.0.0.1:8766`. Les unités dans `deploy/` lancent le serveur et `cloudflared` en arrière-plan. L'adresse `trycloudflare.com` est temporaire et peut changer au redémarrage du tunnel. Pour retrouver l'adresse actuelle :

```bash
journalctl --user -u romantique-tunnel.service --no-pager | rg -o 'https://[a-z0-9-]+\.trycloudflare\.com' | tail -1
```

## Personnaliser

Toutes les données personnelles se trouvent dans [`js/config.js`](js/config.js). Modifiez `girlfriendName`, `boyfriendName`, `mainMessage` et `finalQuestion` ; ces valeurs sont reprises automatiquement aux endroits concernés. `startDate` accepte une date au format `AAAA-MM-JJ`.

Pour changer les autres textes, ouvrez `index.html`. Le quiz est défini dans le tableau `quiz` de `js/main.js`. Les couleurs et la mise en page sont dans `css/style.css`.

### Ajouter des photos et des souvenirs

Placez vos images optimisées dans `assets/images/`, puis ajoutez des objets dans `photos` ou `futurePhotos` :

```js
photos: [
  { src: 'assets/images/nous.jpg', title: 'Nous deux', caption: 'Notre journée préférée.' }
],
```

La section « Les petits morceaux de nous » apparaît dès qu'au moins une photo, une date, une chanson ou un souvenir est renseigné. Vous pouvez aussi remplir :

```js
startDate: '2024-06-15',
song: { title: 'Notre chanson', url: 'https://exemple.com/notre-chanson' },
memories: [{ title: 'Notre premier rendez-vous', text: 'Une histoire à nous.' }],
privateJokes: [{ title: 'Notre blague', text: 'On est les seuls à comprendre.' }],
travels: [{ title: 'Notre voyage', text: 'Une belle aventure.' }],
futurePhotos: [{ src: 'assets/images/prochain-voyage.jpg', title: 'À venir', caption: 'Bientôt nous.' }]
```

Les images sont chargées au fil du défilement. Préférez WebP ou AVIF et une largeur adaptée (environ 1200 px maximum pour les cartes) pour garder une page rapide.

## Publier gratuitement

Le projet utilise des chemins relatifs et peut être hébergé tel quel :

- **GitHub Pages** : poussez le dossier dans un dépôt GitHub, puis ouvrez **Settings → Pages**. Choisissez **Deploy from a branch**, la branche principale et le dossier `/ (root)`.
- **Netlify** : glissez-déposez le dossier du projet dans Netlify, ou connectez le dépôt GitHub. Le dossier de publication est la racine du projet ; aucune commande de build.
- **Cloudflare Pages** : connectez le dépôt, sélectionnez le framework **None**, laissez la commande de build vide et indiquez `.` comme dossier de sortie (ou utilisez l'envoi direct des fichiers).

Les polices Google améliorent l'apparence lorsque le réseau est disponible. Des polices système prennent le relais hors ligne. Les animations se réduisent automatiquement quand le système demande moins de mouvement.

## Organisation

```text
index.html              Structure et textes du site
css/style.css           Design, responsive et animations
js/config.js            Prénoms et souvenirs personnalisables
js/main.js              Interactions
assets/images/          Mascotte, icône et futures photos
```
