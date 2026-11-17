Planten verzorgen is vooral een kwestie van het op het juiste moment doen. Daarom bouwde ik Plantalive: een app op een Raspberry Pi die mijn planten herkent op foto, hun gezondheid scoort en elke ochtend met een AI-tuinier de check-ins in mijn agenda zet. Een mooie puzzel over hoe je zorg kunt automatiseren zonder dat het onpersoonlijk wordt.

Planten hebben geen vast schema, maar ze krijgen er meestal wel een opgelegd. Ik wilde een systeem dat kijkt naar wat een plant echt nodig heeft, en dat ook past bij mijn eigen week.

Het dashboard (beeld 1) laat in één blik zien welke plant water nodig heeft, welke een check-in wil en welke het goed doet. Elke plant heeft een eigen foto en een gezondheidsscore.

Een check-in (beeld 2) is simpel: foto maken, aangeven hoe de aarde en de bladeren eruitzien en of je water hebt gegeven. De AI herkent de soort, geeft een score van 1 tot 10, legt uit wat hij ziet en past het gietschema aan.

Het slimme zit in de dagelijkse taak (beeld 3). Elke ochtend leest een AI-assistent de plantdata, bekijkt mijn agenda en plant de check-ins op momenten die echt kunnen, bijvoorbeeld net voor een vakantie in plaats van tijdens. Bij een plant die er slecht voor staat vraagt hij vaker om een foto. Elke taak komt met een link terug in de app. Technisch is het een Node.js-server op een Raspberry Pi, met de Claude API voor de plantanalyse.
