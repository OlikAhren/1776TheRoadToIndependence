# 1776: The Road To Independence

## Project Overview

A browser-based, mobile-friendly, turn-based political strategy game about the creation and adoption of the Declaration of Independence in 1776.

**Current Status:** Beta - Game Design Document Phase

---

## Quick Start

### For Players
This is currently in development. Follow the repository for updates on when the game becomes playable.

### For Developers
See the full [Game Design Document](docs/GDD.md) for complete specifications.

---

## Folder Structure

```
Declaration Game/
├── README.md                      # This file
├── docs/                          # Documentation
│   └── GDD.md                    # Complete Game Design Document
├── sources/                       # Source code (future)
│   ├── frontend/                  # React web application
│   ├── backend/                   # Node.js server (if needed)
│   └── shared/                    # Shared types/utilities
├── assets/                        # Art, audio, media
│   ├── maps/                     # Colony map graphics
│   ├── portraits/                # Delegate character art
│   ├── ui/                       # UI elements and icons
│   └── audio/                    # Music and SFX
├── data/                          # Game data files
│   ├── delegates.json            # Delegate profiles
│   ├── colonies.json             # Colony definitions
│   ├── events.json               # Event database
│   └── declaration.txt           # Declaration text structure
└── tests/                         # Test suite (future)
```

---

## Game Features

### Core Gameplay
- **Turn-based political strategy** - Manage colonial support through negotiation
- **Historically grounded** - Based on actual events from June-August 1776
- **Multi-platform** - Works on desktop browsers and mobile devices
- **Four difficulty modes** ranging from "Common Sense" to "Join or Die"
- **Three game modes**: Historical, Sandbox ("The Altered States"), and Educational

### Key Mechanics
- **Delegate negotiation** - Persuade Continental Congress members
- **Resource management** - Balance Action Points, Influence, and Supplies
- **Document drafting** - Shape the Declaration's content and tone
- **Colonial politics** - Navigate inter-colonial relationships
- **Dynamic events** - Respond to historical and random occurrences

---

## Difficulty Levels

| Mode | Name | Description |
|------|------|-------------|
| Easy | **Common Sense** | Tutorial-friendly, forgiving penalties |
| Medium | **Don't Tread on Me** | Balanced challenge, historical accuracy |
| Hard | **The British are Coming** | Tight constraints, harsh punishments |
| Extreme | **Join or Die** | Minimal resources, maximum complexity |

---

## Development Status

### Current Phase: Design & Planning ✅
- [x] Game concept finalized
- [x] Game Design Document completed
- [x] Difficulty levels defined
- [x] Game modes specified

### Next Phase: Prototype (Weeks 1-4)
- [ ] Core turn structure implementation
- [ ] Basic delegate interaction system
- [ ] Simplified map visualization
- [ ] Gameplay loop testing

---

## Technical Requirements

### For Development
- Node.js v18+
- npm or yarn package manager
- Git for version control
- Modern web browser (Chrome/Firefox/Safari/Edge)

### Target Platforms
- Desktop: Chrome, Firefox, Safari, Edge
- Mobile: iOS 14+, Android 10+ (mobile browsers)

---

## Historical Notes

When historical details are uncertain, the game flags them with footnotes rather than inventing information. The Educational Mode includes scholarly annotations and primary source links for all historical content.

Key uncertainties flagged in design:
- Exact delegate attendance numbers by date
- Private delegate motivations (inferred from correspondence)
- 1776 population figures (estimates vary)
- Quantitative sentiment levels (reconstructed from voting records)
- Specific conversations without written records (dramatized)

---

## Credits

**Lead Designer:** Brandon Vanderford  
**Historical Consultation:** Based on scholarly works including:
- *Journals of the Continental Congress* (Library of Congress)
- *The Papers of Thomas Jefferson* (Princeton University Press)
- *John Adams: A Life* by Joseph Ellis
- *American Creation* by Joseph J. Ellis
- *1776* by David McCullough

---

## License

All content in this repository is proprietary and confidential. Not for distribution without explicit permission.

---

## Contact & Updates

For project updates, feature requests, or bug reports, please open an issue in the repository.

**Version:** 1.0-Beta  
**Last Updated:** October 13, 2026
