Looking after plants is mostly about doing the right thing at the right moment. That is why I built Plantalive: an app on a Raspberry Pi that recognises my plants from a photo, scores their health and, every morning, puts the check-ins in my calendar together with an AI gardener. A nice puzzle about how you can automate care without it becoming impersonal.

Plants have no fixed schedule, but they usually get one imposed on them. I wanted a system that looks at what a plant really needs, and that also fits my own week.

The dashboard (image 1) shows at a glance which plant needs water, which wants a check-in and which is doing well. Every plant has its own photo and a health score.

A check-in (image 2) is simple: take a photo, indicate how the soil and the leaves look and whether you gave water. The AI recognises the species, gives a score from 1 to 10, explains what it sees and adjusts the watering schedule.

The clever part is in the daily task (image 3). Every morning an AI assistant reads the plant data, looks at my calendar and schedules the check-ins at moments that actually work, for example just before a holiday instead of during it. For a plant that is doing badly it asks for a photo more often. Every task comes with a link back into the app. Technically it is a Node.js server on a Raspberry Pi, using the Claude API for the plant analysis.
