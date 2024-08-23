## Riedel RRCS

Control a Riedel Artist Intercom Matrix with Riedel Router Control System.

[Riedel Artist Intercom](https://www.riedel.net/en/products-solutions/intercom/artist-matrix-intercom/software)

Tested with RRCS Version 8.6.1

Ports can be selected from a list, or entered directly via the address. The drop down list is easier, but only populates when online, the address scehema can be used offline and will accept variables. Addresses are normally specified as two, three or five period seperated numbers. Such as \<net\>.\<node\>.\<port\>. This schema accepts a single, or multiple variables, or a combination of static text and variables, depending on the use case.

### Actions

- Crosspoint - Get All Active
- Crosspoint - Set
- Crosspoint - Set Volume
- GP - Set Output
- IFB - Get All
- IFB - Mix Minus Volume
- Key - Label & Marker
- Key - Lock
- Key - Press
- Logic - Get All Sources
- Logic - Set Source
- Port - Clone
- Port - Get All
- Port - Set IO Gain
- Port - Set Alias
- Port - Set Label

### Feedbacks

- Crosspoint
- GP Input
- GP Output
- Logic Source

### Variables

- Recieved String

### Action Recorder

- Set Crosspoint
- Set GP Output
- Set Logic Source

### Limitations

- Action Recorder

Set Crosspoint, Set GP Output always created with decimal address.

- Crosspoint - Set Volume

Does not work when destination port is connected to an Artist-1024.

- Get All IFB, Logic, Ports

These will repopulate the drop down lists in actions & feedbacks.

- GP Input Feedback

Does not work with panels connected to an Artist-1024.

- Logic Source

Action & Feedback only available when RRCS has reported configured logic sources; can not be configured offline.

- Port & GPIO Numbers

RRCS uses 0-based numbering for Port and GPIO numbers. This module converts them to 1-based numbering for consistency with Director, however internal logs are 0-based.
