# Nuclear Safety-Grade I&C System Architecture Diagram References

A curated list of publicly available architecture diagrams and references for nuclear safety-grade instrumentation and control (I&C) systems. Organized by topic area.

---

## 1. Overall I&C System Architecture of Modern Nuclear Power Plants

### 1.1 AP1000 (Westinghouse)

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 1 | AP1000 DCD Chapter 7 - Instrumentation and Control (Rev 17) | https://www.nrc.gov/docs/ML1035/ML103510080.pdf | Official AP1000 Design Control Document Chapter 7 covering the complete I&C architecture including PMS, DAS, PLS, and data communication networks. |
| 2 | AP1000 DCD Chapter 7 - I&C Architecture Description (Draft SE) | https://www.nrc.gov/docs/ML0332/ML033290058.pdf | DCD Tier 2 Section 7.1 describing the AP1000 general I&C system architecture with emphasis on protection and safety monitoring systems. |
| 3 | AP1000 DCD Chapter 7 (Earlier Draft SE) | https://www.nrc.gov/docs/ML0316/ML031671500.pdf | Earlier version of the DCD Tier 2 Section 7.1 I&C architecture description. |
| 4 | AP1000 DCD Rev 19 - Instrumentation Section 2.5 | https://www.nrc.gov/docs/ML1117/ML11171A313.pdf | Describes the PMS with four divisions of Reactor Trip and ESF Actuation, and two divisions of post-accident parameter displays. |
| 5 | AP1000 Data Communication Overview (DJS 2008) | https://arhiv.djs.si/proc/port2008/pdf/1208.pdf | Standalone paper providing a high-level I&C architecture diagram of the AP1000 certified design, focusing on data communication aspects. Contains system-level block diagrams. |
| 6 | AP1000 I&C Architecture (Scribd - ML11171A465) | https://www.scribd.com/doc/173822959/ML11171A465 | Section 7.1 describing the AP1000 I&C architecture including PMS and how Common Q fits into the overall plant design. |
| 7 | AP1000 Plant Overview (IEEE NPEC Presentation) | https://site.ieee.org/npec-sc2/files/2017/06/SC-2Mgt03-2_Att7-Hayes-AP1000.pdf | IEEE presentation with plant overview including I&C architecture and DAS design principles. |
| 8 | AP1000 Plant Description (Westinghouse/APCNEAN) | https://www.apcnean.org.ar/arch/3e139fc91ebe2e675db2194460badc7c.pdf | Westinghouse document describing the DAS as providing alternative means of initiating reactor trip and ESF. Hardware is diverse from PMS. |

### 1.2 EPR (Framatome/Areva/EDF)

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 9 | UK EPR GDA Step 3 C&I Assessment (ONR) | https://www.onr.org.uk/media/pqhhrykn/step3-uk-epr-ci-assessment.pdf | UK Office for Nuclear Regulation assessment of the EPR C&I architecture. Describes the two main platforms: Teleperm XS (safety) and Teleperm XP (operational). Contains architecture diagrams. |
| 10 | US EPR Design Control Document Chapter 7 (NRC) | https://www.nrc.gov/docs/ML1307/ML13073A579.pdf | Official US NRC DCD for the EPR. Chapter 7 covers the full I&C architecture based on TELEPERM XS (TXS) for safety and TELEPERM XP (TXP) for operational control. Comprehensive architecture diagrams. |
| 11 | Advanced Digital I&C Technology in NPPs (Bled 2005) | https://arhiv.djs.si/proc/bled2005/htm/pdf/00070.pdf | Conference paper describing EPR I&C based on TELEPERM XS and TELEPERM XP platforms plus OM 690 operating/monitoring system. |
| 12 | Safety and Nonsafety Communications in I&C Architecture (SciSpace) | https://scispace.com/pdf/safety-and-nonsafety-communications-and-interactions-in-2jsht9pck3.pdf | Discusses the N4 and EPR I&C architecture including interactions between TXS (safety) and TXP (non-safety) platforms. Contains architecture figures and diagrams. |
| 13 | IAEA/INIS - Advanced I&C Systems for NPPs | https://inis.iaea.org/records/8c7dz-1hb90/files/28055292.pdf?download=1 | Covers both TELEPERM XS (Category A safety) and TELEPERM XP (non-safety operational control). |
| 14 | Framatome TELEPERM XS Product Page | https://www.framatome.com/solutions-portfolio/product/a0628/ | Official Framatome product page for TELEPERM XS platform with overview diagrams. |
| 15 | Framatome I&C Overview | https://www.framatome.com/en/expertise/instrumentation-and-control/ | Framatome's I&C systems overview adapted to each reactor design. |

### 1.3 ABWR (GE Hitachi / Toshiba / Hitachi)

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 16 | IAEA TECDOC 1848 - Digital I&C | https://www-pub.iaea.org/MTCD/Publications/PDF/TE1848-web.pdf | Discusses ABWR digital I&C implementation including programmable digital technology in the reactor protection system. |
| 17 | SECY-91-292 - Digital Computer Systems for ALWRs | https://www.nrc.gov/docs/ML1814/ML18145A017.pdf | NRC document discussing digital computer systems for advanced LWR designs including ABWR. |
| 18 | Digital Safety System for ABWR (ScienceDirect) | https://www.sciencedirect.com/science/article/abs/pii/S0029549398001861 | Paper describing the ABWR digital safety system consisting of RPS and ESF system. **Figure 2 contains the system architecture diagram.** |
| 19 | Experience with Digital I&C in Evolutionary Plants (ORNL) | https://info.ornl.gov/sites/publications/Files/Pub57800.pdf | Detailed ORNL report on ABWR I&C using digital and fiber optic technologies. Describes four-division Safety System Logic and Control (SSLC). |
| 20 | UK ABWR Generic PCSR Chapter 14 | https://www.hitachi-hgne-uk-abwr.co.uk/downloads/2017-12-14/UKABWR-GA91-9101-0101-14000-RevC-PB.pdf | Official Hitachi UK ABWR Pre-Construction Safety Report covering the SSLC, RPS, ECCS, and ESF architecture. Contains detailed architecture diagrams. |

### 1.4 HPR1000 / Hualong One (CGN / CNNC)

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 21 | UK HPR1000 PCSR Chapter 8 - I&C (GDA) | https://ukhpr1000.co.uk/wp-content/uploads/2018/11/HPR-GDA-PCSR-0008-Pre-Construction-Safety-Report-Chapter-8-Instrumentation-and-Control.pdf | **Primary reference.** Contains the official "Overall I&C Architecture Chart" (Figure F-8.5-1) for HPR1000. Describes the full digital I&C design including protection, control, and safety-related systems. |
| 22 | ONR Step 4 Assessment of C&I for UK HPR1000 | https://www.onr.org.uk/media/documents/gda/uk-hpr1000/step-4/onr-nr-ar-21-005.pdf | UK ONR independent assessment of HPR1000 C&I architecture. Contains regulatory review of the digital protection and control systems. |
| 23 | HPR1000 Technical Introduction (JAIF/PDF) | https://www.jaif.or.jp/cms_admin/wp-content/uploads/2018/04/51st-annual_Jun_Li_ja.pdf | Detailed HPR1000 design features including reactor coolant system and safety system architecture with multiple system architecture diagrams. |
| 24 | Safety Approach and Assessment of Hualong One (IFNEC) | https://www.ifnec.org/ifnec/upload/docs/application/pdf/2018-06/2.t_xin_safety_approach_and_safety_assessment_of_hualong_one_2018-06-08_11-13-28_805.pdf | Safety design philosophy including dedicated I&C control systems for severe accidents. |
| 25 | HPR1000 I&C Backup Reactor Shutdown (ResearchGate) | https://www.researchgate.net/publication/405121035_Function_analysis_and_implementation_scheme_of_HPR1000_nuclear_power_plant_digital_instrumentation_and_control_systems_backup_reactor_shutdown | Academic paper on HPR1000 digital I&C function analysis for backup reactor shutdown. |

---

## 2. Reactor Protection System (RPS) Architecture

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 26 | NRC - System Design Description for RPS | https://www.nrc.gov/docs/ML2328/ML23289A260.pdf | Official NRC document providing comprehensive design description for a digital RPS, referencing IEC 60987 hardware design standards. |
| 27 | PLC-based RPS Development (ResearchGate) | https://www.researchgate.net/publication/378252903_Development_of_PLC-based_reactor_protection_system | Research paper on PLC-based RPS design in accordance with international standards. Likely contains architecture diagrams. |
| 28 | Seamless Platform Change of RPS (ScienceDirect) | https://www.sciencedirect.com/science/article/pii/S1738573315300334 | Discusses safety-grade PLCs for RPS and platform migration strategies. |
| 29 | RDE Reactor Protection System Architecture (IOP Science) | https://iopscience.iop.org/article/10.1088/1742-6596/1198/5/052007/pdf | Architecture diagram for the RDE (10 MW HTGR) reactor protection system including input parameters assessment. |
| 30 | First Digital RPS in China (Gen-4 GIF) | https://www.gen-4.org/gif/upload/docs/application/pdf/2022-11/the-first-digital-reactor-protection-system-i_2002_nuclear-engineering-and-d.pdf | Describes the first digital RPS designed and operated in China (10 MW HTR). |
| 31 | Westinghouse Plant Protection System | https://westinghousenuclear.com/data-sheet-library/plant-protection-system/ | Commercial Westinghouse RPS product page - monitors temperatures, pressures, levels, flows, and nuclear instrumentation. |
| 32 | RPS Patent (WO2017101031A1) - Chinese NPP | https://patents.google.com/patent/WO2017101031A1/zh | Patent for a nuclear power plant reactor protection system with N protection channels. Contains system architecture diagram. |
| 33 | Dynamic Reliability Analysis of HPR1000 RPS (ScienceDirect) | https://www.sciencedirect.com/science/article/abs/pii/S0951832023000625 | Discusses RPS reliability of Hualong-1 digital I&C systems. |
| 34 | Reliability Analysis Model of Digital RPS (ResearchGate) | https://www.researchgate.net/publication/347537461_Reliability_Analysis_Model_of_the_Digital_Reactor_Protection_System | System availability and failure rate analysis methodology for digital reactor trip and ESF actuation systems. |

---

## 3. Diverse Actuation System (DAS) Architecture

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 35 | AP1000 I&C Defense-in-Depth (NRC) | https://www.nrc.gov/docs/ML0212/ML021220228.pdf | Describes the nonsafety DAS providing reactor trip and ESF actuations diverse from the PMS. Key layer of defense-in-depth. |
| 36 | AP1000 DAS GDA Issues (ONR/UK) | https://www.onr.org.uk/media/jbgasvit/onr-nr-ar-16-029.pdf | UK ONR document addressing DAS safety justification and ensuring DAS design meets regulatory expectations. |
| 37 | Diverse Actuation System for US AP1000 (IAEA/INIS) | https://inis.iaea.org/records/0ntb4-cye20 | Describes the DAS as a non-safety-related system providing alternate means of initiating reactor trip, diverse backup to PMS. |
| 38 | DAS Implementation in ACPR1000 (Wiley) | https://onlinelibrary.wiley.com/doi/10.1155/2021/5529570 | Discusses DAS implementation in ACPR1000 nuclear power plants, including economic and feasibility considerations of DAS sharing architectures. |
| 39 | AP1000 Step 4 Summary Report (ONR/UK) | https://www.onr.org.uk/media/sbkc5dng/ap1000-onr-gda-sr-11-002-rev-0.pdf | Describes the overall I&C architecture comprising PMS, plant control system, DAS, reactor control rods, and boration systems. |

---

## 4. Digital Control System (DCS) Layered Architecture

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 40 | Overall Architecture of Advanced PWR I&C System (ResearchGate Figure) | https://www.researchgate.net/figure/Overall-architecture-of-the-advanced-PWR-in-I-C-system-see-online-version-for-colours_fig3_264816999 | **Direct figure link.** Shows the major DCS components within the overall I&C architecture and interfaces to HSI and unit bus. |
| 41 | Instrumentation and Controls Architectures in New NPPs (ResearchGate) | https://www.researchgate.net/publication/264816999_Instrumentation_and_controls_architectures_in_new_NPPs | Parent publication of the above figure. Describes I&C systems as the "nervous system" of NPPs. |
| 42 | Hierarchical Architecture of DCS Network (ResearchGate Figure) | https://www.researchgate.net/figure/Hierarchical-architecture-of-the-DCS-network_fig1_2475021 | **Direct figure link.** Proposes three levels of hierarchical networks for distributed digital control systems in NPPs. |
| 43 | Design of Networks for Distributed DCS in NPPs (ResearchGate) | https://www.researchgate.net/publication/2475021_Design_Of_Networks_For_Distributed_Digital_Control_Systems_In_Nuclear_Power_Plants | Parent publication proposing three-level hierarchical DCS networks for NPPs. |
| 44 | Architecture of KNX-5 DCS (ResearchGate Figure) | https://www.researchgate.net/figure/Architecture-of-KNX-5_fig1_228431527 | **Direct figure link.** Three-level hierarchical architecture of the KNX-5 DCS. |
| 45 | Advanced Control Systems for NPP Reliability (ResearchGate PDF) | https://www.researchgate.net/profile/Mohamed-Mourad-Lafifi/post/How_to_develop_complete_expertise_on_bioreactor_control_systems_starting_from_scratch/attachment/606464490f39c700013dba25/AS%3A1007390451306501%401617192008255/download/Advanced+control+systems+to+improve+nuclear+power+plant+reliability+and+efficiency.pdf | Describes overall I&C architecture composed of different systems according to different safety classes. |
| 46 | KHNP Design Control Document (NRC) | https://www.nrc.gov/docs/ML1328/ML13281A745.pdf | Describes how non-safety I&C systems are implemented by a DCS-based common platform. |
| 47 | Advanced Supervisory Control System Architecture (ORNL) | https://info.ornl.gov/sites/publications/files/Pub45186.pdf | ORNL report presenting hierarchical structure of an advanced supervisory control system for advanced reactors. |
| 48 | Non-Safety DCS Minimum System (ResearchGate) | https://www.researchgate.net/publication/316674422_The_research_and_development_of_non_safety_DCS_minimum_system_in_nuclear_power_plant | R&D of non-safety minimum Digital I&C system as a multifunctional platform. |
| 49 | Nuclear Safety-Class DCS Maintenance Optimization (ScienceDirect) | https://www.sciencedirect.com/science/article/pii/S1738573322002601 | Discusses nuclear safety-class DCS for reactor protection functions. |

---

## 5. Defense-in-Depth I&C Architecture

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 50 | I&C Architecture in Nuclear Safety (Scribd Presentation) | https://www.scribd.com/presentation/924674502/P13-I-C-System-Architecture | Presentation defining "overall I&C architecture" and mapping DiD levels to I&C functions. **Contains layered architecture diagrams.** |
| 51 | Analyzing DiD Properties of NPP I&C Architecture (SAFER2028) | https://safer2028.fi/wp-content/uploads/BjorkmanNPICHMIT2023.pdf | Ontology-based approach for assessing that an NPP I&C architecture fulfills defense-in-depth properties. Contains architecture analysis diagrams. |
| 52 | Challenges in DiD and I&C Architectures (VTT Finland) | https://publications.vtt.fi/julkaisut/muut/2016/VTT-R-00090-16.pdf | Reviews literature on modeling and analyzing overall I&C architectures for nuclear. References IEC 61513 (2011) for safety importance levels. |
| 53 | DiD and Diversity: Challenges Related to I&C (WNA/CORDEL) | https://world-nuclear.org/images/articles/CORDEL-Defence-in-Depth-Report-10-April.pdf | Detailed analysis of differences in DiD definitions between regulatory bodies and nuclear codes/standards related to I&C diversity. |
| 54 | Historical Review of Defense-in-Depth (NRC) | https://www.nrc.gov/docs/ML1610/ML16104A071.pdf | Reviews the concept of defense-in-depth as a key element of NRC safety philosophy, including historical evolution. |
| 55 | Safety and Security DiD for NPPs (OSTI) | https://www.osti.gov/servlets/purl/1832309 | Discusses identifying digital I&C subfunctions and correlating them to overall safety functions. |
| 56 | Next Generation Nuclear Plant DiD Approach (INL) | https://digital.library.unt.edu/ark:/67531/metadc929187/m2/1/high_res_d/971362.pdf | Reviews regulatory foundation for DiD and proposes a definition appropriate for advanced reactors. |
| 57 | Nuclear Power Station C&I Architecture (SafetyInEngineering) | https://www.safetyinengineering.com/wp-content/uploads/2022/04/nuclear-CI-architecture-v2_1330947816_2.pdf | Detailed illustrated guide on nuclear plant C&I architecture design stages. **Contains architecture diagrams** from overall C&I architecture to system functional requirements. |

---

## 6. Hardware Diversity Architecture

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 58 | Westinghouse Common Q Platform (Product Page) | https://westinghousenuclear.com/data-sheet-library/westinghouse-common-q-platform/ | Official product page. Common Q implements Class 1E systems: RPS, ESFAS, PAMS. |
| 59 | Common Qualified Platform Topical Report (NRC) | https://www.nrc.gov/docs/ML1311/ML13112A108.pdf | **Primary reference.** Official NRC topical report describing the Common Q platform design with detailed architecture diagrams. |
| 60 | Common Q Platform and CIM System (NRC SE) | https://www.nrc.gov/docs/ML2032/ML20325A035.pdf | NRC safety evaluation for WCAP-18461 covering Common Q platform and Component Interface Module system. |
| 61 | Safety-Related I&C Pilot Upgrade Conceptual Design (INL) | https://inldigitallibrary.inl.gov/sites/sti/sti/Sort_66259.pdf | INL report on Plant Protection System (PPS) implemented using Common Q platform. |
| 62 | Westinghouse Approach to I&C Modernization (IAEA/INIS) | https://inis.iaea.org/records/metvr-8ad80/files/24042542.pdf?download=1 | Westinghouse system architecture for monitoring plant safety functions during and following accidents. |
| 63 | Common Q+ Safety Human Machine Interface (Westinghouse) | https://westinghousenuclear.com/data-sheet-library/common-qplus-safety-human-machine-interface/ | Modernized Safety HMI for the Common Q platform. |
| 64 | Generic HSI Architecture for NPP Modernization (PDF) | https://www.thinklogical.com/wp-content/uploads/2022/04/Vendor-Independent-Requirements-for-a-Boiling-Water-Reactor-Safety-System-Upgrade-Paper-2020-DKT-Excerpt.pdf | Notes Common Q uses video generators in all four safety-related divisions. |
| 65 | IRSN - Principles for Digital I&C Design | https://research-assessment.asnr.fr/sites/en/files/2023-12/IRSN_Safety-approaches_digital-instrumentation-and-control_2017.pdf | Covers design principles for digital I&C in nuclear, including increasing computation and interconnection. Relevant to EPR digital I&C architectures (Teleperm XS/XP). |
| 66 | Curtiss-Wright Reactor Protection and Control | https://cwic.curtisswright.com/solutions/reactor-protection-and-control/ | Curtiss-Wright Guardline platform for customized I&C safety systems. |

---

## 7. IEC 61513 and Standards-Based I&C Architecture Framework

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 67 | IAEA SSG-39 / PUB1694 - Design of I&C Systems for NPPs | https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1694_web.pdf | **Definitive IAEA Safety Guide.** Provides guidance on overall I&C architecture and systems important to safety. Key reference for IEC 61513-based architecture framework. |
| 68 | IAEA Nuclear Energy Series PUB1821 - Overall I&C Architecture | https://www-pub.iaea.org/MTCD/Publications/PDF/PUB1821_web.pdf | Comprehensive overview of approaches for overall I&C architecture of NPPs. Likely contains framework diagrams. |
| 69 | Safety Classification for I&C Systems (WNA/CORDEL) | https://world-nuclear.org/images/articles/CORDEL-DICTF%20Safety%20Classification.pdf | References IEC 61513 Section 5.4.2 (Design of I&C architecture) specifying correlation between I&C system classes and function categories. |
| 70 | Classification Approach for Digital I&C (NRC) | https://www.nrc.gov/docs/ML1209/ML120970232.pdf | Discusses the Beltracchi framework for analyzing I&C system requirements. References IEC standards for safety-important systems. |
| 71 | IEC 61513 Nuclear I&C Safety Requirements (Standards Catalog) | https://standards.iteh.ai/catalog/standards/clc/1b9aa659-3942-4859-99d5-97aec3b04012/en-61513-2013 | The standard itself - defines requirements for overall I&C architecture, safety life cycles, system qualification. |
| 72 | ONR Common Position - Licensing Safety Critical Software | https://www.onr.org.uk/media/i2anr3nd/24-09-common-position-2024-revision-1.pdf | UK ONR document referencing IEC 61513 and IEC 61226 for nuclear I&C important to safety. |
| 73 | Engineering Nuclear Safety: IEC 61513 (LinkedIn) | https://www.linkedin.com/pulse/engineering-nuclear-safety-why-iec-61513-core-ic-systems-kurtkaya-e1z1f | Article discussing defense-in-depth as a multi-layered shield per IEC 61513. |
| 74 | Inside the Brain of a Nuclear Reactor: Safety by Design (Medium) | https://medium.com/nuclear-i-c-systems-safety/inside-the-brain-of-a-nuclear-reactor-safety-by-design-a40c6c4f5967 | Discusses IEC 61513 deterministic safety principles in the framework context. |

---

## 8. Chinese Nuclear I&C Systems (Domestic Platforms)

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 75 | FirmSys - First Application at Million-kW NPP (CAEA) | https://www.caea.gov.cn/n6760338/n6760342/c6829237/content.html | Describes China's first自主 nuclear safety-grade DCS product (FirmSys/和睦系统) and its role as the "nerve center" of NPPs. |
| 76 | FirmSys-8000 Next-Generation Platform (CNPN) | https://www.cnnpn.cn/article/53869.html | Describes the "five-station, five-network, one-base" (五站五网一个底座) overall architecture of the new FirmSys-8000 platform. |
| 77 | CGN Nuclear DCS Cybersecurity (China-NEA) | https://www.china-nea.cn/site/content/38765.html | Describes the "Harmony Guardian" (和睦卫士) cybersecurity system for nuclear DCS. |
| 78 | FirmSys-6000 Domestically Produced DCS (SASAC) | http://www.sasac.gov.cn/n4470048/n29955503/n30143035/n30143047/n30143148/c30150235/content.html | Describes FirmSys-6000, the domestically produced version based on domestic chips and OS. |
| 79 | CGN Digital Tech "Smart Brain" Release (NNSA) | https://nnsa.mee.gov.cn/ywdt/hyzx/202511/t20251125_1134749.html | Describes FirmSys applied across 33 nuclear units including Hualong One, VVER, and HTGR. |
| 80 | CNNC First Military-Civilian Safety DCS Platform (CAEA) | https://www.caea.gov.cn/n6760341/n6760359/c6827035/content.html | CNNC's "Dragon Scale" (龙鳞) system - China's first military-civilian fusion safety-grade DCS platform. |
| 81 | Decoding Nuclear Intelligence: China's Neural Center (Xinhua) | http://www.news.cn/energy/20250624/3b7028af8de5493a95add8b1610e4332/c.html | Describes safety-grade DCS as the "safety guardian" and non-safety DCS as the "super brain." |
| 82 | Beijing CTEC (广利核) DCS Solutions | http://www.ctecdcs.com/ctecdc2/c102066/list_tt.shtml | Official page of the FirmSys developer - specialized in nuclear DCS design, manufacturing, and engineering. |

---

## 9. General I&C Architecture References (Multi-Reactor / Generic)

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 83 | IAEA - I&C Systems for NPPs (Topic Page) | http://www.iaea.org/topics/operation-and-maintenance/instrumentation-and-control-systems-for-nuclear-power-plants | IAEA overview of I&C systems purpose in NPPs. |
| 84 | IAEA TECDOC-1016 - Modernization of I&C | https://www-pub.iaea.org/MTCD/Publications/PDF/te_1016_prn.pdf | Covers I&C modernization including protection systems for operating and partially built plants. |
| 85 | IAEA TECDOC-1662 - IERICS | https://www-pub.iaea.org/MTCD/Publications/PDF/TE1662web.pdf | IAEA mission for Independent Engineering Review of I&C Systems in NPPs. |
| 86 | I&C Architecture PRA Literature Review (SAFER2028) | https://safer2028.fi/wp-content/uploads/PRALINE-D2.2.1.pdf | Literature review on I&C system architecture from a probabilistic risk assessment perspective. |
| 87 | Advanced Reactor OT Architecture (Sandia) | https://www.sandia.gov/app/uploads/sites/273/2024/11/SANDArchitectureCategorizationAdvanceReactors-M2CT-21SN1104024.pdf | Sandia report on operational technology architecture categorization for advanced reactors. |
| 88 | NPP I&C Book Chapter (IntechOpen) | https://cdn.intechopen.com/pdfs/21051/InTechNuclear_power_plant_instrumentation_and_control.pdf | Open-access book chapter covering I&C for normal, abnormal, and emergency NPP operation. |
| 89 | I&C System Design via Viewpoints Analysis (MBSE/Capella) | https://mbse-capella.org/resources/pdf/IS2018_Architecture-Design-of-NPP-systems-through-viewpoints-analysis_v1.8.pdf | MBSE method using Arcadia/Capella to define NPP system architecture including protection systems. |
| 90 | IAEA PUB2100 - Life Cycle Management of I&C | https://www-pub.iaea.org/MTCD/publications/PDF/p15653-PUB2100_web.pdf | Systems engineering in I&C systems for nuclear facilities. |
| 91 | Safety Classification for I&C (WNA) | https://world-nuclear.org/images/articles/safety-classification-for-i-c-cdkc.pdf | WNA report on safety classification status and challenges for I&C systems in NPPs. |

---

## 10. AP1000 NUREG-1793 Safety Evaluation

| # | Resource | URL | Description |
|---|----------|-----|-------------|
| 92 | NUREG-1793 Volume 1 (NTIS) | https://ntrl.ntis.gov/NTRL/dashboard/searchResults/titleDetail/NUREG1793V1.xhtml | Primary Final Safety Evaluation Report for AP1000 design certification. |
| 93 | Safety I&C System Description and Design Process (NRC) | https://www.nrc.gov/docs/ML0707/ML070720369.pdf | Covers GDC 13 I&C functions within safety equipment. Likely AP1000-related DCD section. |

---

## Summary of Best Sources for Architecture Diagrams

### Highest Priority (Most Likely to Contain Detailed Diagrams)

1. **AP1000:** DCD Chapter 7 (Refs 1-4), Data Communication Overview (Ref 5), NUREG-1793 (Ref 92)
2. **EPR:** UK EPR C&I Assessment (Ref 9), US EPR DCD Chapter 7 (Ref 10), Bled 2005 Paper (Ref 11)
3. **ABWR:** ScienceDirect Paper with Figure 2 (Ref 18), UK ABWR PCSR Chapter 14 (Ref 20), ORNL Report (Ref 19)
4. **HPR1000:** UK HPR1000 PCSR Chapter 8 with Figure F-8.5-1 (Ref 21) -- **THE primary diagram source**
5. **Defense-in-Depth:** SafetyInEngineering Guide (Ref 57), Scribd Presentation (Ref 50), VTT Report (Ref 52)
6. **DCS Architecture:** ResearchGate Figure - Advanced PWR I&C (Ref 40), Hierarchical DCS Network (Ref 42)
7. **Common Q Platform:** NRC Topical Report (Ref 59) -- the foundational design document
8. **IEC 61513 Framework:** IAEA SSG-39 (Ref 67), IAEA PUB1821 (Ref 68), WNA Safety Classification (Ref 69)

### Direct Figure/Image Links

- https://www.researchgate.net/figure/Overall-architecture-of-the-advanced-PWR-in-I-C-system-see-online-version-for-colours_fig3_264816999
- https://www.researchgate.net/figure/Hierarchical-architecture-of-the-DCS-network_fig1_2475021
- https://www.researchgate.net/figure/Architecture-of-KNX-5_fig1_228431527
