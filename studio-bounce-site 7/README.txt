STUDIO BOUNCE WEBSITE
=====================

Open:
  index.html

Structure:
  index.html
  css/main.css
  js/main.js

  kinderkamer/index.html
  kinderkamer/css/kinderkamer.css
  kinderkamer/js/kinderkamer.js

Links:
- Main site -> Kinderkamer landing page via the footer link "Kinderkamers".
- Kinderkamer landing page -> main site via the header navigation and footer links.

Notes:
- The existing images remain embedded in the HTML as data images, so this package works without an extra images folder.
- The "Alle reviews" button currently returns to the reviews section until a dedicated reviews page or Google Reviews URL is supplied.
- Replace the placeholder WhatsApp number in the JavaScript with the real Studio Bounce number before publishing.


Nieuwe conceptpagina's
----------------------
muurschildering-brabant/
  index.html
  css/brabant.css
  js/brabant.js

muurschildering-breda/
  index.html
  css/breda.css
  js/breda.js

Doorgelinkt:
- Homepage -> Brabant via werkgebied + footer
- Homepage -> Breda via footer
- Kinderkamer -> Brabant/Breda via footer
- Brabant -> Breda via plaatskaart
- Breda -> Brabant via breadcrumb + regiolink

Teksten en specifieke lokale projectbeelden zijn concept en kunnen later met de klant worden aangescherpt.

Visual update
-------------
De conceptwebsite gebruikt nu de nieuwe/grotere Studio Bounce beelden uit deze chat.
De beelden staan los in /assets/images/ als geoptimaliseerde WebP-bestanden.

Belangrijk:
- De homepage hero gebruikt de 16:9 foto van Studio Bounce van achteren terwijl ze de jungle/giraffe mural schildert.
- De Over mij-sectie gebruikt de aangeleverde portretfoto.
- Portfolio, Kinderkamer, Brabant en Breda gebruiken nu verschillende relevante beelden.
- Filter + lightbox op de homepage zijn behouden.

Homepage mockup conversion
--------------------------
index.html / css/main.css / js/main.js zijn opnieuw opgebouwd op basis van de goedgekeurde homepage-mockup:
- grote asymmetrische hero met zachte inham
- ronde detailfoto
- benefits-strip
- uniforme portfolio-grid met werkende filters + lightbox
- Over mij + Reviews naast elkaar
- reviews tonen 3 kaarten op desktop en hebben pijlen
- coral CTA-band en donkere footer

LET OP:
- WhatsApp gebruikt nog 31600000000 als placeholder.
- Twee extra reviewkaarten zijn expliciet placeholders voor het testen van de carrousel.

Main homepage combi
-------------------
De homepage is opnieuw opgebouwd als combinatie van:
- de duidelijke, losse secties van de Kinderkamer landing page
- Zo werkt het + FAQ
- Inter als font voor alle tekst en headings
- de grote hero-inham, ronde detailfoto en subtiele cut-outs van de home-v2 mockup

De bestaande Kinderkamer-, Brabant- en Breda-pagina's zijn behouden.
WhatsApp gebruikt nog een placeholdernummer (31600000000).
Twee reviewkaarten zijn placeholders om de carrousel te testen.

Feedback 20-08-2026 verwerkt
----------------------------
Deze build gebruikt uitsluitend studio-bounce-site(1).zip als baseline.

Home:
- hero-titel kleiner + compactere regelafstand
- ronde detailfoto verwijderd
- selling point aangepast naar Midden- en Zuid-Nederland
- decoratieve uitsparing uit Over mij verwijderd
- portfolio naar 3 grotere kolommen
- Zo werkt het tekstbreedte verbeterd + duidelijk kwasticoon
- knop 'Schrijf een review' toegevoegd (Google review-URL nog invullen)
- FAQ-foto verwijderd
- CTA video-ready gemaakt en middenlijn verwijderd
- WhatsApp-uitleg toegevoegd

Kinderkamer:
- hero kleiner en meer beeldgericht, geïntegreerde foto i.p.v. oude ronde vorm
- USP-iconen zonder cirkel, consistent met home
- losse review verwijderd
- CTA ongeveer halve hoogte en één foto
- socials in footer

Brabant:
- hero meer beeldgericht, geïntegreerde foto
- rechts bij 'Van idee naar muur' een foto
- witte iconen in roze bolletjes bij 'Voor iedere ruimte'
- socials in footer

Breda:
- hero-titel kleiner
- rechts bij 'Persoonlijk maatwerk' een foto
- 'Voor thuis en zakelijk' verwijderd
- losse review verwijderd
- socials in footer

Globaal:
- subpage headers gelijkgetrokken met home

Consistency pass v3
-------------------
A shared /css/site-system.css has been added as the canonical design system.

Standardized site-wide:
- Header markup and styling
- Footer markup and styling
- Inter typography
- Container width
- Section spacing
- Buttons
- Eyebrows / section headings
- Card radii
- USP icon treatment
- Process cards / process icons
- Review cards / review arrows
- FAQ accordions
- CTA radii and shadows
- Mobile navigation

Page-specific layouts (hero composition, city/regional content etc.) remain distinct on purpose.
