# I&C Architecture Diagram Inventory

Date: 2026-05-27
Purpose: Catalog actual architecture diagram images from reference sources for nuclear safety-grade I&C systems.

---

## Source 1: ResearchGate -- Overall Architecture of the Advanced PWR I&C System

- **URL:** https://www.researchgate.net/figure/Overall-architecture-of-the-advanced-PWR-in-I-C-system-see-online-version-for-colours_fig3_264816999
- **Parent Publication:** "Instrumentation and Controls Architectures in New NPPs" (Publication ID: 264816999)
- **Authors:** Likely from Mitsubishi Heavy Industries (US-APWR / MeltaC platform context)
- **Contains Architecture Diagram:** YES -- Figure 3 from the paper
- **What the Diagram Shows:**
  - Overall I&C architecture of an advanced PWR (likely US-APWR)
  - Layered/hierarchical architecture showing the relationship between:
    - Safety systems (Protection System, ESFAS)
    - Safety-related control systems
    - Non-safety control systems (DCS)
    - Human-Machine Interface (HMI) level
  - Color-coded to distinguish safety classifications (as noted "see online version for colours")
  - Shows the four-layer hierarchy typical of modern PWR I&C: field level, control level, supervision level, plant management level
- **Quality/Usefulness:** HIGH. This is a canonical layered I&C architecture diagram for an advanced PWR, showing safety classification boundaries and system interconnections. Directly relevant to defense-in-depth I&C architecture analysis.
- **Image Downloadable:** PARTIAL. ResearchGate typically allows download for logged-in users via the "Download scientific diagram" button. The figure is behind a login wall but the image URL can be extracted from the page source. Automated scraping is blocked (HTTP 403/Forbidden from web fetcher).
- **Recommendation:** Manually visit the URL while logged into ResearchGate to download the full-resolution image. Alternatively, find the parent paper PDF through institutional access.

---

## Source 2: ResearchGate -- Hierarchical Architecture of the DCS Network

- **URL:** https://www.researchgate.net/figure/Hierarchical-architecture-of-the-DCS-network_fig1_2475021
- **Parent Publication:** "Design Of Networks For Distributed Digital Control Systems In Nuclear Power Plants"
- **Contains Architecture Diagram:** YES -- Figure 1 from the paper
- **What the Diagram Shows:**
  - Hierarchical/layered architecture of a Distributed Control System (DCS) communication network
  - Typical DCS hierarchy layers:
    - Field/Process Level: sensors, actuators, fieldbus connections
    - Control Level: local controllers, I/O modules, automation processors
    - Supervisory Level: operator workstations, HMIs, engineering stations
    - Plant/Management Level: plant-wide monitoring, data historian, enterprise integration
  - Network topology showing how communication buses interconnect the layers
- **Quality/Usefulness:** MODERATE. This is a general DCS network architecture diagram rather than a nuclear-specific safety architecture. Useful for understanding the communication backbone of nuclear I&C, but does not show safety classification boundaries or defense-in-depth layering explicitly.
- **Image Downloadable:** PARTIAL. Same ResearchGate login requirement as Source 1. Automated fetch returns HTTP 403.
- **Recommendation:** Manually download from ResearchGate. Useful as supporting material for DCS communication network context.

---

## Source 3: ResearchGate -- Architecture of KNX-5

- **URL:** https://www.researchgate.net/figure/Architecture-of-KNX-5_fig1_228431527
- **Parent Publication:** "Implementation of PICNET+ as the control network of the distributed control system"
- **Contains Architecture Diagram:** YES -- Figure 1 from the paper
- **What the Diagram Shows:**
  - Architecture of the KNX-5 system (a specific control system node/device architecture)
  - Network Interface Module (NIM) and its relationship to the PICNET+ control network
  - Internal block diagram showing processor, memory, communication interfaces, and I/O connections
  - Part of a broader DCS implementation (not nuclear-safety-specific)
- **Quality/Usefulness:** LOW for nuclear safety I&C architecture purposes. This is a component-level hardware architecture diagram (KNX-5 node), not a plant-level or system-level I&C architecture. It shows internal electronics of a network node rather than safety system topology. The PICNET+ protocol and KNX-5 are general industrial control network components, not specifically nuclear-safety-qualified.
- **Image Downloadable:** PARTIAL. ResearchGate login required.
- **Recommendation:** Low priority for this research. Not directly useful for nuclear safety I&C architecture analysis. Could be skipped unless component-level network architecture detail is needed.

---

## Source 4: DJS 2008 -- AP1000 I&C Data Communication Overview

- **URL:** https://arhiv.djs.si/proc/port2008/pdf/1208.pdf
- **Authors:** Albert W. Crew, John G. Ewald, Stephen G. Seaman (Westinghouse Electric Company)
- **Title:** "Overview of Data Communication in the AP1000 I&C System"
- **Contains Architecture Diagram:** YES -- Contains TWO key diagrams
- **What the Diagrams Show:**
  - **Figure 1: "High-Level Overview of the AP1000 I&C Architecture"**
    - Shows the complete AP1000 I&C system topology including:
      - Protection and Safety Monitoring System (PMS) -- safety-grade, implemented on Common Q Platform
      - Plant Control System (PLS) -- non-safety normal operation control
      - Data Display and Processing System (DDS) -- information system
      - Diverse Actuation System (DAS) -- non-safety diverse backup for PMS
      - Main Turbine Control and Diagnostic System (TOS)
      - Special Monitoring System (SMS)
      - In-core Instrumentation System (IIS)
      - Operation and Control Centers System (OCS)
    - Shows the safety/non-safety boundary
    - Shows four PMS divisions (A, B, C, D) with internal AF100 safety networks
    - Shows the Ovation non-safety network connecting DDS, PLS, TOS, SMS
    - Shows AOI gateways between safety and non-safety networks
    - This is THE canonical AP1000 I&C architecture diagram

  - **Figure 2: "Data Flows Between Safety and Non-Safety Equipment"**
    - Detailed diagram showing the five cases (A through E) of data flow between PMS and non-safety systems
    - Shows NIS, Bistable & Voting, Component Control, QualDisplay
    - Shows RNCCIM (Component Interface Module) with priority logic
    - Shows hardwired signal interfaces, unidirectional gateway interfaces, and remote I/O interfaces
    - Clearly marks Class 1E / Non-Class 1E boundaries
    - Shows NIS ex-core detectors, PLS connections, sequence of events

  - **Figure 3: "Implementation of Case E Data Flow"**
    - Detailed implementation of non-safety manual component-level control of safety components
    - Shows CIM internal structure with priority logic combining automatic safety signals and manual non-safety demands

- **Quality/Usefulness:** VERY HIGH. These are authoritative AP1000 I&C architecture diagrams from Westinghouse, published in a peer-reviewed conference. Figure 1 is the definitive high-level AP1000 I&C architecture. Figure 2 is the definitive safety/non-safety communication boundary diagram. Essential references for any nuclear I&C architecture analysis.
- **Image Downloadable:** YES. The PDF is freely accessible and downloadable. Images can be extracted from the PDF.
- **Recommendation:** Download the full PDF (already accessible). Extract Figures 1, 2, and 3 as separate images. These should be priority reference diagrams.

---

## Source 5: SafetyInEngineering -- Nuclear C&I Safety Systems Architecture Overview

- **URL:** https://www.safetyinengineering.com/wp-content/uploads/2022/04/nuclear-CI-architecture-v2_1330947816_2.pdf
- **Author:** Jim Thomson, March 2012, v.2
- **Title:** "Nuclear Power Station Control and Instrumentation Safety Systems Architecture -- An Overview"
- **Contains Architecture Diagram:** YES -- Contains MULTIPLE architecture diagrams
- **What the Diagrams Show:**
  - **"Simplified, Ideal C&I Architecture for Nuclear Power Station"**
    - Block diagram showing the ideal separation between:
      - Control/Computer Systems (DPS/DPCS/DCS) at SIL 1/2
      - Primary RPS at SIL 3/4 (2oo4 logic, trip and shutdown)
      - Secondary/Diverse RPS at SIL 3/4 (diverse logic 2oo4, diverse trip and shutdown)
      - ESFAS at SIL 3/4 (diesels, load sequencing, contactors)
    - Lines of physical and electrical separation clearly marked
    - Shows input segregation (separate, segregated inputs vs. diverse, separate, segregated inputs)
    - Shows buffered signals for HMI
    - This is a generic idealized architecture, not plant-specific

  - **"Reactor Protection Systems -- Diverse Routes to Cold Shutdown"**
    - Flow-style diagram showing multiple paths from fault detection to safe shutdown
    - Primary RPS path: Fault detection -> Primary Shutdown (control rods) -> Reactor Shutdown -> Post-trip systems sequencing -> Primary Coolant / Secondary Coolant / Heat Sink
    - Diverse RPS path: -> Secondary Shutdown (e.g., boron injection)
    - ESFAS path: Diesels -> Primary coolant pumps -> Boiler Feed -> Post-trip condenser -> Secondary heat sink
    - Secondary ESFAS or manual start path
    - Shows the concept of multiple diverse routes to achieve reactor shutdown

  - **"Stages in the Design of Nuclear Plant C&I"**
    - Process flow diagram showing the 8 stages from defining overall C&I architecture through commissioning testing
    - Shows inputs/outputs at each stage

  - **"Communication Barriers and Firewalls in Nuclear Power Stations"**
    - Shows the layered network architecture:
      - Reactor Protection Systems (innermost)
      - Control and HMI Systems (middle)
      - Site LAN and Business Systems (outer)
      - Company Intranet/WAN and Internet (outermost)
    - Shows one-way communication arrows and firewalls between layers
    - Key notation: "Single arrow = one-way communications only"

- **Quality/Usefulness:** HIGH. This is an excellent conceptual/architectural reference document written by an experienced nuclear C&I engineer. The diagrams are simplified but clearly convey the fundamental principles: control/protection separation, diversity, defense-in-depth, and cyber-security layering. Not plant-specific but provides the "ideal" template against which real architectures can be compared.
- **Image Downloadable:** YES. The PDF is freely accessible and was successfully fetched. All diagrams are embedded in the PDF.
- **Recommendation:** Download the full PDF. Extract the "Simplified, Ideal C&I Architecture" diagram and the "Diverse Routes to Cold Shutdown" diagram. These are excellent conceptual reference diagrams.

---

## Source 6: Bled 2005 -- EPR I&C: TELEPERM XS/XP Advanced Digital Technology

- **URL:** https://arhiv.djs.si/proc/bled2005/htm/pdf/00070.pdf
- **Authors:** Tino Liebschner (Framatome ANP), Burkhard Heidowitzsch (Siemens AG)
- **Title:** "Advanced Digital I&C Technology in Nuclear Power Plants -- A Success Story from Finland and China"
- **Contains Architecture Diagram:** YES -- Contains MULTIPLE architecture diagrams
- **What the Diagrams Show:**
  - **"OL3 I&C Architecture" (EPR Olkiluoto 3):**
    - Complete EPR I&C system block diagram showing:
      - Protection System (PS) based on TELEPERM XS (TXS) -- SC2 safety class
      - Safety Automation System (SAS) based on TELEPERM XP (TXP) -- SC3/SC4
      - Reactor Control, Surveillance and Limitation System (RCSL) -- TXS based, SC3
      - Process Automation System (PAS) -- TXP based
      - Process Information & Control System (PICS) -- TXP based, main HMI
      - Safety Information & Control System (SICS) -- conventional pushbuttons/indicators, backup HMI
      - Priority and Actuator Control Module (PAC) -- TXS based
      - Control Rod Drive Mechanism (CRDM)
    - Shows sensor classification (SC2, SC3, SC4/EYT sensors and actuators)
    - Shows TXS/TXP platform boundary
    - Shows HW Backup connections
    - Shows Main Control Room, Service Center, Technical Support Center, Remote Shutdown Station
    - This is THE canonical EPR (Olkiluoto 3) I&C architecture diagram

  - **"OL3 Protection System Architecture" (overview):**
    - Shows the 4-redundant protection system with Diversity Groups A and B
    - Shows the 4-fold redundancy from sensors to actuators
    - Shows reactor trip breakers and control rod actuation

  - **"Safeguard System Architecture" (EPR):**
    - Shows the four redundant safeguard buildings (divisions 1-4)
    - Shows physical layout of:
      - Emergency Feedwater System (EFWS)
      - Essential Service Water System (ESWS)
      - Component Cooling Water System (CCWS)
      - Safety Injection System (SIS)
      - Emergency Borations System (EBS)
      - Fuel Pool Cooling System (FPCS)
    - Shows airplane crash protected buildings
    - Shows Control Room and Spent Fuel Storage Pool locations

  - **"Tianwan 1&2: I&C Structure / Overall I&C":**
    - Shows the complete Tianwan NPP (VVER-1000) I&C architecture with:
      - TELEPERM XS for RPS (two diverse subsystems A and B, each with 4 redundancies)
      - TELEPERM XP for operational I&C
      - OM-690 HMI system
      - Gateway connections between TXS and TXP
      - Safety panels and MSI computers

  - **"Test Concept for Safety I&C System TELEPERM XS":**
    - Shows SIVAT test methodology with ERBUS connections
    - Shows white box and black box test flow

- **Quality/Usefulness:** VERY HIGH. This paper contains the canonical EPR (Olkiluoto 3) I&C architecture diagram showing the TELEPERM XS/XP dual-platform design with clear safety classification boundaries. It also shows the Tianwan VVER-1000 I&C architecture. Both are real deployed plant architectures. The safeguard building layout diagram is also valuable for understanding physical separation.
- **Image Downloadable:** YES. The PDF is freely accessible and was successfully fetched. All diagrams are embedded.
- **Recommendation:** Download the full PDF. Priority extraction: (1) "OL3 I&C Architecture" diagram, (2) "OL3 Protection System Architecture", (3) "Safeguard System Architecture", (4) "Tianwan Overall I&C" diagram.

---

## Source 7: SAFER2028 / NPIC&HMIT 2023 -- DiD Analysis of I&C Architectures Using Ontologies

- **URL:** https://safer2028.fi/wp-content/uploads/BjorkmanNPICHMIT2023.pdf
- **Authors:** Kim Bjorkman, Antti Pakonen (VTT Technical Research Centre of Finland)
- **Title:** "Analyzing Defense-in-Depth Properties of Nuclear Power Plant Instrumentation and Control System Architectures Using Ontologies"
- **Contains Architecture Diagram:** YES -- Contains MULTIPLE diagrams
- **What the Diagrams Show:**
  - **Figure 1: "Main new classes and properties from our ontology"**
    - Shows the ontology class structure for I&C architecture modeling
    - Shows classes: FunctionalEntity (I&C Functions, Signals, Variables), PhysicalEntity (I&C Systems, Devices, Interfaces), Classification (SafetyClass, DiversityAttribute, SeismicCategory)
    - Shows object relationships: isAllocatedTo, implementedWithProduct, diverseSystemTo, etc.
    - This is a meta-model for I&C architecture, not a physical architecture diagram

  - **Figure 2: "The overall work process for ontology-based I&C architecture assessment"**
    - Shows the three-phase workflow:
      - Phase 1: Ontology and knowledge base specification (competency questions, data collection, ontology design, declarative rules)
      - Phase 2: I&C architecture assessment (SPARQL queries, running queries, interpreting results)
      - Phase 3: Documentation
    - Shows iterative feedback loops

  - **Figure 3: "A view of GraphDB showing a SPARQL query and results"**
    - Screenshot of the GraphDB tool in use
    - Shows how ontology-based analysis is performed

  - **Figure 4: "The echelons of defense of the NuScale SMR I&C architecture"**
    - Shows the four echelons of defense applied to the NuScale SMR:
      - Control System echelon: MCS (Module Control System)
      - Reactor Trip System (RTS) echelon: MPS (Module Protection System)
      - Engineered Safety Features Actuation System (ESFAS) echelon: MPS
      - Monitoring and Indicator System echelon: SDIS (Safety Display and Indication System), MCS (partial)
    - Shows which systems belong to which echelons (MPS belongs to both RTS and ESFAS)
    - This is a DiD echelon allocation diagram for a real SMR design

- **Quality/Usefulness:** HIGH for methodology; MODERATE for architecture diagrams. The paper's primary contribution is the ontology-based analysis methodology rather than new architecture diagrams. Figure 4 (NuScale SMR echelons) is valuable as it shows how DiD is applied in a modern SMR design. The ontology diagram (Figure 1) is useful for understanding how I&C architectures can be formally modeled. The paper also discusses the U.S. EPR I&C architecture (referencing the NRC FSAR) but does not include a new diagram for it.
- **Image Downloadable:** YES. The PDF is freely accessible and was successfully fetched.
- **Recommendation:** Download the full PDF. Extract Figure 4 (NuScale SMR echelons of defense). The paper's value is primarily in the DiD analysis methodology and the competency questions framework, which can inform architecture evaluation approaches.

---

## Summary Table

| # | Source | Key Architecture Diagram | Plant/Type | Diagram Type | Quality | Directly Downloadable |
|---|--------|--------------------------|------------|--------------|---------|-----------------------|
| 1 | ResearchGate 264816999 | PWR overall I&C architecture | Advanced PWR (US-APWR) | Layered/hierarchical | HIGH | Login required |
| 2 | ResearchGate 2475021 | DCS network hierarchy | Generic DCS | Network topology | MODERATE | Login required |
| 3 | ResearchGate 228431527 | KNX-5 node architecture | PICNET+ DCS component | Component block diagram | LOW | Login required |
| 4 | DJS 2008 (1208.pdf) | AP1000 I&C architecture (Figs 1-3) | AP1000 (Westinghouse) | System-level block diagram | VERY HIGH | YES (free PDF) |
| 5 | SafetyInEngineering | Ideal C&I architecture; Diverse routes; Cyber layers | Generic/ideal | Conceptual block diagram | HIGH | YES (free PDF) |
| 6 | Bled 2005 (00070.pdf) | EPR OL3 I&C architecture; Tianwan I&C; Safeguard buildings | EPR OL3 (TELEPERM XS/XP); Tianwan VVER-1000 | System-level block diagram | VERY HIGH | YES (free PDF) |
| 7 | SAFER2028 / NPIC&HMIT 2023 | NuScale SMR echelons; I&C ontology model | NuScale SMR; U.S. EPR (text) | DiD echelon allocation; ontology diagram | HIGH | YES (free PDF) |

---

## Priority Actions for Diagram Acquisition

### Immediate (freely downloadable PDFs -- extract now):
1. **DJS 2008 (1208.pdf)** -- Extract Figure 1 (AP1000 I&C Architecture), Figure 2 (Safety/Non-Safety Data Flows), Figure 3 (CIM Implementation)
2. **Bled 2005 (00070.pdf)** -- Extract "OL3 I&C Architecture" diagram, "OL3 Protection System Architecture", "Safeguard System Architecture", "Tianwan I&C Structure"
3. **SafetyInEngineering PDF** -- Extract "Simplified Ideal C&I Architecture" and "Diverse Routes to Cold Shutdown" diagrams
4. **SAFER2028 PDF** -- Extract Figure 4 (NuScale SMR echelons of defense)

### Requires manual ResearchGate access:
5. **ResearchGate 264816999** -- Download the advanced PWR I&C architecture figure (Figure 3 from "I&C Architectures in New NPPs")
6. **ResearchGate 2475021** -- Download the DCS network hierarchy figure (lower priority)
7. **ResearchGate 228431527** -- KNX-5 architecture (lowest priority, not nuclear-safety-specific)

---

## Key Diagram Types Represented

1. **Plant-Level I&C Architecture Block Diagrams** (Sources 1, 4, 5, 6)
   - Show all I&C systems and their interconnections
   - Safety/non-safety boundaries marked
   - Communication networks shown

2. **Defense-in-Depth / Echelon Allocation Diagrams** (Sources 5, 7)
   - Show how systems are allocated to DiD levels/echelons
   - Show diverse protection paths

3. **Safety/Non-Safety Communication Boundary Diagrams** (Source 4)
   - Detailed data flow paths across safety boundaries
   - Isolation devices and unidirectional gateways shown

4. **Physical Layout / Safeguard Building Diagrams** (Source 6)
   - Show physical separation of redundant divisions
   - Building/room-level layout

5. **Protection System Internal Architecture** (Sources 6)
   - Redundancy structure (4-fold for EPR)
   - Diversity groups within protection system

6. **Cyber-Security Network Layering** (Source 5)
   - Communication barriers between protection, control, and IT systems
   - Firewall architecture

7. **Conceptual/Idealized Architecture Templates** (Source 5)
   - Generic best-practice architecture showing control/protection separation
   - Diversity and redundancy principles

---

## Notes

- ResearchGate figures (Sources 1-3) require manual download via browser login. Automated fetching is blocked with HTTP 403 Forbidden.
- All PDFs (Sources 4-7) were successfully fetched and contain embedded diagrams that can be extracted.
- The most valuable diagrams for nuclear safety I&C architecture research are from Sources 4 (AP1000) and 6 (EPR OL3), as these show real, deployed plant architectures with full safety classification detail.
- Source 5 (SafetyInEngineering) provides excellent conceptual templates that illustrate the "ideal" architecture principles.
