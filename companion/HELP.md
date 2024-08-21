## Riedel RRCS

Control a Riedel Artist Intercom Matrix with Riedel Router Control System.

[Riedel Artist Intercom](https://www.riedel.net/en/products-solutions/intercom/artist-matrix-intercom/software)

Tested with RRCS Version 8.6.1

### Actions

- Get Active Crosspoints
- Get All Logic Sources
- Key - Label & Marker
- Key - Lock
- Key - Press
- Port - Clone
- Set Crosspoint
- Set Crosspoint Volume
- Set GP Output
- Set IO Gain
- Set Logic Source
- Set Port Alias
- Set Port Label

### Feedbacks

- Crosspoint
- GP Input
- GP Output
- Logic Source

### Action Recorder

- Set Crosspoint
- Set GP Output
- Set Logic Source

### Limitations

- Set Crosspoint Volume

Does not work when destination port is connected to an Artist 1024.

- GP Input Feedback

Does not work with panels connected to an Artist-1024.

- Port & GPIO Numbers

RRCS uses 0-based numbering for Port and GPIO numbers. This module converts them to 1-based numbering for consistency with Director. However interval logs are 0-based.
