# Nuclear Safety-Grade I&C System Software Heterogeneous Design: Research Compilation

## Table of Contents
1. Software Diversity Strategies Overview
2. NUREG/CR-6303 Diversity Guidelines
3. IEC 60880 Requirements
4. Real Implementation Examples
5. Software Diversity Effectiveness Studies
6. Practical Challenges
7. Modern Approaches: Formal Methods & Static Analysis
8. D3 Analysis Framework
9. Key References & Sources

---

## 1. Software Diversity Strategies Overview

### 1.1 N-Version Programming (NVP)
N-version programming is a software fault tolerance technique where multiple independent versions of a program are developed from the same specification by separate development teams. All versions execute in parallel, and a voting/consensus mechanism determines the correct output.

**Key characteristics:**
- Multiple independently developed software versions from common specification
- Parallel execution with voting logic (typically majority voting)
- Aimed at tolerating residual design faults through design diversity
- Originally proposed by Avizienis (1985) for fault-tolerant computing

**Application in nuclear I&C:**
- Applied to safety-critical reactor protection systems (RPS)
- Combined with functional diversity and signal diversity
- Typically uses 2 or 3 diverse versions rather than full NVP
- Voting may be 2-out-of-3 (2003) or 2-out-of-4 (2004) logic

### 1.2 Recovery Blocks
Recovery blocks are a software fault tolerance technique introduced by Brian Randell (1975):
- A **primary module** executes the critical function
- An **acceptance test** checks the output for reasonableness
- If the test fails, one or more **alternate (diverse) modules** are executed sequentially
- If all alternatives fail, an exception is raised
- Used in nuclear safety as a diverse backup strategy

### 1.3 Diverse Software Backup Systems
The predominant approach in nuclear I&C:
- **Primary Protection System (PPS)**: Main digital safety system
- **Diverse Actuation System (DAS)/Secondary Protection System (SPS)**: Backup using different software, hardware, and often different technology
- Designed to mitigate Common Cause Failures (CCF) in the primary digital system

---

## 2. NUREG/CR-6303 Software Diversity Guidelines

### 2.1 Document Overview
- **Title**: "Method for Performing Diversity and Defense-in-Depth Analyses of Reactor Protection Systems"
- **Published**: December 1994 (U.S. NRC)
- **Full document**: https://www.nrc.gov/docs/ML0717/ML071790509.pdf

### 2.2 Six Diversity Attributes
NUREG/CR-6303 establishes **six diversity attributes** with associated criteria:

| Attribute | Definition | Contributing Factors |
|-----------|-----------|---------------------|
| **Human Diversity** | Different designers, programmers, testers | Different management teams, design organizations, programmers, engineers |
| **Design Diversity** | Different approaches to solve the same problem | Different technologies, different approaches with same technology, different architectures with same technology |
| **Software Diversity** | Different programs by different teams for same goal | Different algorithms/logic, programming languages, program architecture, operating systems, timing |
| **Functional Diversity** | Different physical functions with overlapping safety effects | Different mechanisms, purposes, functions, control logic, actuation means, response timescales |
| **Signal Diversity** | Different sensed parameters for protective action | Different parameters with different effects, different parameters with same effects, same parameter with different sensors |
| **Equipment Diversity** | Different equipment for similar safety functions | Different manufacturers with different designs, same manufacturer with different designs, different manufacturers with same designs |

### 2.3 Criteria Hierarchy
- NUREG/CR-6303 identifies **25 related diversity criteria** organized by effectiveness
- Criteria within each attribute are ordered by effectiveness (most effective first)
- Higher effectiveness criteria may be sufficient alone; less effective ones can compensate
- The framework provides a systematic method for evaluating CCF vulnerability

### 2.4 Four Echelons of Defense
The methodology categorizes I&C systems into **four echelons of defense**:
1. **Control systems** (Echelon 1): Maintain plant within normal operating limits
2. **Reactor trip / Protection systems** (Echelon 2): Detect and respond to abnormal conditions
3. **Engineered Safety Features (ESF)** (Echelon 3): Mitigate accident consequences
4. **Monitoring and indication** (Echelon 4): Provide operator information

### 2.5 NUREG/CR-7007 Update (2010)
- **Title**: "Diversity Strategies for Nuclear Power Plant Instrumentation and Control Systems"
- **Full document**: https://www.nrc.gov/docs/ML1005/ML100541256.pdf
- Builds upon NUREG/CR-6303 with key changes:
  - Renamed "human" diversity to "life-cycle" diversity
  - Renamed "software" diversity to "logic" diversity (to cover all programmable devices)
  - Split "equipment" attribute into "equipment manufacturer" and "logic processing equipment"
  - Provides quantitative scoring methodology for diversity assessment

---

## 3. IEC 60880 Requirements for Software Diversity

### 3.1 Standard Overview
- **Standard**: IEC 60880:2006 — "Nuclear power plants — Instrumentation and control systems important to safety — Software aspects for computer-based systems performing Category A functions"
- **Scope**: Applies to the highest safety category (Category A) functions in nuclear power plants
- **IEEE SA page**: https://standards.ieee.org/ieee/60880/12037

### 3.2 Key Requirements
- Specifies software requirements for nuclear I&C systems performing **Category A** (highest safety) functions
- Mandates rigorous V&V processes rather than prescribing specific techniques
- States objectives for software development methods
- For Category A systems, where diverse safety systems are required:
  - If one is computer-based, another should use **diverse technology/software**
  - Functional diversity (e.g., trip on both pressure and temperature limits) is referenced
- Emphasizes **structured development lifecycle** and **independent V&V**

### 3.3 Related Standards
- **IEC 61513**: General requirements for I&C systems important to safety
- **IEC 62138**: Software for Category B and C functions
- **IAEA SSG-39**: Design of Instrumentation and Control Systems for Nuclear Power Plants
- **UK ONR NS-TAST-GD-046**: Specifically addresses software diversity for Category A functions — https://www.onr.org.uk/operational/tech_asst_guides/ns-tast-gd-046.pdf

---

## 4. Real Implementation Examples

### 4.1 Sizewell B (UK) — Pioneer of Digital Protection Systems

**Overview**: Sizewell B (1200 MWe PWR, Suffolk, UK, commissioned 1995) was the **first nuclear power station in the Western world** to use software-based reactor protection systems.

**Architecture:**
| Aspect | Primary Protection System (PPS) | Secondary Protection System (SPS) |
|--------|--------------------------------|-----------------------------------|
| **Channels** | 4 guardlines (coincidence voting, 2-out-of-4) | 2 trains |
| **Separation** | 4-way physical and electrical | 2-way segregation |
| **Technology** | Microprocessor-based, software-intensive | Different microprocessor type, different software |
| **Power Supply** | Primary supply system | Secondary (diverse) supply system |
| **Software Size** | ~100,000 lines of source code | Diverse implementation |

**Diversity Features:**
- PPS and SPS use **different processors and different software implementations**
- Software produced to highest integrity standards (equivalent to SIL 4)
- Rigorous retrospective static analysis performed on PPS software
- Software safety assessed by UK Nuclear Installations Inspectorate

**Key References:**
- IEEE: "Software Safety Assessment and the Sizewell B Applications" — https://ieeexplore.ieee.org/document/172006/
- IEEE: "The Engineering Specification, Design and Implementation of the Secondary Protection System" — https://ieeexplore.ieee.org/document/172010/
- Springer: "The Rigorous Retrospective Static Analysis of the Sizewell 'B' Protection System Software"
- Hunns & Wainwright: "The UK Regulator's Approach to the Acceptance of a Software-based Protection System for Sizewell B"

### 4.2 EPR (Flamanville 3 / Olkiluoto 3 / UK EPR)

**Overview**: The EPR design uses a **dual-platform digital I&C architecture** to achieve software diversity.

**Architecture:**
| Aspect | Protection System (PS) | Control/Operational System |
|--------|----------------------|---------------------------|
| **Platform** | **TELEPERM XS** (Framatome/Areva) | **SPPA-T2000** (Siemens) |
| **Function** | Safety/protection functions | Operational control functions |
| **Diversity** | Safety-grade (Class 1E) | Different vendor, different technology |

**Diversity Strategy:**
- Two fundamentally different digital platforms provide protection against CCF
- The EPR includes a dedicated **Diverse Actuation System** for CCF mitigation
- IAEA INIS document covers diverse functions for Flamanville 3: https://inis.iaea.org/records/avdp7-tsr55
- UK ONR assessed the EPR I&C architecture through Generic Design Assessment: https://www.onr.org.uk/media/pqhhrykn/step3-uk-epr-ci-assessment.pdf
- French ASNR description: https://regulation-oversight.asnr.fr/information/news-archives/I-C-architecture-of-the-Flamanville-3-EPR
- Framatome TELEPERM XS brochure: https://www.framatome.com/solutions-portfolio//app/uploads/2025/09/a0628-txs-brochure-a4114afc1928a94254a661d0839821d5d6.pdf

### 4.3 AP1000 (Westinghouse)

**Overview**: The AP1000 uses a dedicated **Diverse Actuation System (DAS)** as backup to the primary Protection and Safety Monitoring System (PMS).

**Architecture:**
- **PMS** (Primary): Safety-related, digital, provides reactor trip and ESF actuation
- **DAS** (Diverse Backup): Uses **different hardware and software** from PMS
  - Designated as non-safety-related but provides defense-in-depth
  - 2-3 redundant channels with separate actuation paths
  - Signals isolated from PMS
  - Provides alternate means of reactor trip and selected ESF actuation

**Key Documents:**
- NRC AP1000 DAS Planning document: https://www.nrc.gov/docs/ML1021/ML102170263.pdf
- NRC AP1000 D3 analysis: https://www.nrc.gov/docs/ML0212/ML021220228.pdf
- IAEA TECDOC 1848: https://www-pub.iaea.org/MTCD/Publications/PDF/TE1848-web.pdf
- Westinghouse PPS data sheet: https://westinghousenuclear.com/data-sheet-library/plant-protection-system/

### 4.4 Korea: APR-1400 / Shin-Kori / KNICS Program

**Overview**: Korea's approach through the APR-1400 reactor design (first deployed at Shin-Kori Units 3 & 4).

**Digital I&C Architecture:**
- **Safety I&C System**: Reactor Protection System (RPS) and Engineered Safety Features - Component Control System (ESF-CCS), both fully digital
- **Diverse Protection System (DPS)**: Backup to primary RPS for CCF mitigation
- Uses **functional diversity** and **software diversity** strategies

**KNICS Program:**
- Korea Nuclear Instrumentation & Control System (KNICS) R&D program developed indigenous platforms:
  - **POSIAQ**: Safety-grade (Class 1E) digital I&C platform (note: sometimes referenced as POSIVA-Q)
  - **POSIVA-S**: Non-safety grade platform
- Software reliability and diversity were key program objectives
- D3 analyses conducted for APR-1400 to satisfy Korean regulatory requirements (KINS) and international standards

**Regulatory Context:**
- Korea Institute of Nuclear Safety (KINS) oversees DI&C safety
- KNS paper on regulatory positions: https://www.kns.org/files/pre_paper/41/19S-712-%EC%8B%A0%EC%8A%B9%EA%B8%B0.pdf
- APR1400 diversity approach reviewed in ANS publication: https://epubs.ans.org/download/?a=39171

### 4.5 China: NASPIC, FirmSys, Hualong One

**Overview**: China has developed multiple indigenous nuclear safety-grade DCS platforms.

**Key Platforms:**
1. **NASPIC** (Nuclear Advanced Safety Platform for I&C): Chinese-developed safety-grade DCS platform
   - IAEA INIS reference for DCS signal de-redundancy: https://inis.iaea.org/records/xknhy-9vr81
2. **FirmSys** (CGN / China General Nuclear): Domestically-developed high-safety nuclear DCS
   - First applied at Yangjiang Nuclear Power Plant
   - Announced 2018: http://en.cgnp.com.cn/encgnp/c100866/2018-05/22/content_4b074fdfad2c4cfda9c15948967ed0eb.shtml
3. **"Hemu System" (和睦系统)**: Another Chinese nuclear-grade DCS controlling 260+ systems and ~10,000 equipment items

**Hualong One (HPR1000) Approach:**
- Combines "active and passive" safety systems with double-shell containment
- Digital Control System (DCS) with advanced Main Control Room (MCR)
- Incorporates defense-in-depth, diversity, and single-failure criteria
- Diverse Containment Cooling System and Fast Depressurization System
- IFNEC presentation: https://www.ifnec.org/ifnec/upload/docs/application/pdf/2018-06/2.t_xin_safety_approach_and_safety_assessment_of_hualong_one_2018-06-08_11-13-28_805.pdf
- Linglong One (SMR) DCS installation: https://news.cgtn.com/news/2024-04-12/China-s-small-nuclear-reactor-starts-installing-digital-control-system-1sJs3fcLsGY/index.html

**Note**: Detailed technical specifications of NASPIC/FITREL software diversity implementations are primarily available in Chinese-language publications and proprietary design documents.

---

## 5. Software Diversity Effectiveness Studies

### 5.1 Knight & Leveson (1986) Experiment

**Paper**: "An Experimental Evaluation of the Assumption of Independence in Multi-Version Programming"
**Published**: IEEE Transactions on Software Engineering (TSE), 1986
**Authors**: John C. Knight & Nancy G. Leveson
**PDF**: http://sunnyday.mit.edu/papers/nver-tse.pdf
**ACM**: https://dl.acm.org/doi/10.1109/TSE.1986.6312924

**Experimental Design:**
- **27 independently developed programs** from the same specification
- Developed by separate programmers/teams at University of Virginia
- All versions implemented the same function (an anti-missile selection algorithm)

**Key Results:**
- The core assumption of NVP — that independently developed versions fail **independently** — was **NOT supported**
- **Correlated faults** were found across independently developed versions
- Programmers tended to make similar mistakes when facing the same difficult problem areas
- Some inputs were inherently more "difficult" and caused multiple versions to fail simultaneously
- **Maximum fault span was 4 in 27 programs** (from review by Adelard)
- The probability of dissimilar or no faults was approximately **85%**

**Significance:**
- One of the most influential empirical studies in software engineering
- Demonstrated that software diversity does not guarantee statistical independence of failures
- Challenged the theoretical reliability gains claimed for N-version programming

**Follow-up Study (1990):**
- Brilliant, Knight, Leveson: "Analysis of Faults in an N-Version Software Experiment"
- Detailed analysis of the specific faults found in all 27 versions
- NASA ADS: https://ui.adsabs.harvard.edu/abs/1990ITSEn..16..238B/abstract

### 5.2 Eckhardt & Lee (1985) Theoretical Analysis

**Paper**: "A Theoretical Basis for the Analysis of Multiversion Software Subject to Coincident Errors"
**Published**: IEEE Transactions on Software Engineering, Vol. SE-11, No. 12, 1985
**Authors**: D.E. Eckhardt & L.D. Lee

**Key Contribution — The EL Model:**
- Introduced a probabilistic model (the **EL model**) explaining why independently developed software versions experience **correlated (coincident) failures**
- Core insight: certain inputs are inherently more "difficult" than others
- The probability of failure varies across the input space according to a **"difficulty function"**
- Versions developed by different teams will tend to fail on the same "difficult" inputs
- This creates **positive correlation** between failures of different versions
- The model provides a theoretical framework for understanding why independence of failures cannot be assumed

**Impact:**
- The EL model has been widely cited and extended in subsequent research
- Provides the theoretical underpinning for understanding limits of software diversity
- Referenced extensively in nuclear safety diversity assessments

**Related References:**
- ScienceDirect (human error diversity): https://www.sciencedirect.com/science/article/pii/S0167642314001312
- Springer (failure correlation): https://link.springer.com/chapter/10.1007/978-3-642-84725-7_6
- City University London review: https://openaccess.city.ac.uk/id/eprint/1951/1/Modelling%20software%20design%20diversity.pdf
- CUHK empirical study: https://www.cse.cuhk.edu.hk/lyu/_media/conference/xcai_issre2004_an.pdf

### 5.3 Hatton (1997) "N-Version Design Versus One Good Version"

**Paper**: "N-Version Design Versus One Good Version"
**Published**: IEEE Software, Vol. 14, No. 6, November/December 1997
**Author**: Les Hatton
**IEEE**: https://www.computer.org/csdl/magazine/so/1997/06/s6071/13rRUx0xQ6a
**PDF**: https://kar.kent.ac.uk/21442/1/N-version_Design_vs._One_Good_Version.pdf

**Key Findings:**
- Investigated whether it is better to develop **one highly reliable ("good") version** or **N independently developed, average-quality versions**
- **Hatton's conclusion**: Evidence suggests N-version development techniques are **more reliable and cost-effective** than a single "good" version
- Considered the **ratio of reliability** between ordinary and state-of-the-art software
- Showed that improvement in component quality has a **non-linear effect** on overall N-version system quality
- The analysis supports the use of design diversity in safety-critical systems

**Counterarguments:**
- Some follow-up work has questioned whether design diversity is always the more cost-effective approach
- The debate centers on whether resources should be concentrated on one exceptional version or distributed across multiple diverse versions

### 5.4 Littlewood & Strigini (2000) Analysis

**Key Paper**: Littlewood B., Popov P.T., Strigini L. & Shryane N. (2000). "Modeling the Effects of Combining Diverse Software Fault Detection Techniques," IEEE Transactions on Software Engineering
**Impact case study**: https://impact.ref.ac.uk/casestudies/CaseStudy.aspx?Id=44358

**Additional Key Work:**
- Strigini & Littlewood: "Software Diversity as a Measure for Reducing Development Risk" — https://openaccess.city.ac.uk/id/eprint/3226/1/Software%2520diversity%2520as%2520a%2520measure.pdf
- Lawrence & Persons: "Evaluating Software for Safety Systems in Nuclear Power Plants" — includes sample implementation of the **Littlewood holistic model**

**Key Findings:**
- Diversity can provide significant reliability improvement but **does not eliminate** CCF risk
- The effectiveness of diversity depends heavily on the **degree of independence** achieved
- Benefits are nuanced — diversity helps but is not a guarantee
- Their work established critical frameworks for understanding how software design diversity can (and cannot) improve reliability in safety-critical systems like nuclear power plants
- The principle remains a cornerstone of nuclear safety regulation (ONR, IAEA, NRC)

---

## 6. Practical Challenges

### 6.1 Cost
- Developing multiple diverse software versions can **double or triple** development costs
- Each version requires independent development teams, tools, and environments
- NUREG/CR-7007 notes that diversity strategies must be balanced against cost
- Different regulatory regimes can result in fundamentally different I&C architectures for the same technology, increasing cost

### 6.2 Verification and Validation (V&V) Effort
- Each diverse software version requires **independent V&V** (IV&V)
- V&V effort scales with the number of diverse versions
- Formal qualification of diverse software is extremely resource-intensive
- Nuclear safety standards (IEC 60880, IEC 61513) mandate extensive V&V for each version
- Metrics and advanced techniques may lower V&V costs (ISBSG reference): https://www.isbsg.org/wp-content/uploads/2021/08/Metrics-in-sware-Verification-IT-Confidence-2015-Fantechi.pdf

### 6.3 Maintenance Burden
- Multiple diverse software versions must be maintained independently throughout plant lifetime (40-60+ years)
- Modifications/updates must be applied and verified separately for each version
- Configuration management complexity increases significantly
- Training requirements multiply for maintenance personnel
- The CORDEL DICTF report notes that "the lack of clear criteria on how to define sufficient diversity has led to more complex I&C architectures" — https://world-nuclear.org/images/articles/CORDEL-Defence-in-Depth-Report-10-April.pdf

### 6.4 Regulatory Complexity
- Different countries have different rules on allowing software-based diverse backup systems
- No harmonized international standard for "sufficient" diversity
- Subjective evaluation criteria lead to inconsistent regulatory outcomes
- CORDEL report identifies this as a major challenge: "The trend has been towards lengthy and more difficult reviews for the treatment of digital CCF vulnerabilities"

---

## 7. Modern Approaches: Formal Methods and Static Analysis

### 7.1 Formal Methods as Alternatives/Complements

**Key insight**: Rather than (or in addition to) developing diverse software, formal methods can provide **mathematical proof** of software correctness, potentially reducing the need for diversity.

**Methods applicable to nuclear safety:**

| Method | Description | Nuclear Application |
|--------|-------------|-------------------|
| **B Method** | Stepwise refinement-based formal specification | Used for SACEM train signaling; influenced nuclear verification |
| **Static Analysis** | Automated mathematical analysis of code properties | Applied retrospectively to Sizewell B PPS software |
| **SPARK Ada** | Ada subset with formal proof capabilities | Grew from UK formal methods community (Praxis) |
| **VDM/Z Notation** | Model-based formal specification | Influenced Sizewell B safety case methodology |
| **Model Checking** | Exhaustive state-space exploration | Increasingly used for nuclear safety verification |
| **Theorem Proving** | Machine-assisted mathematical proof | Applied to safety-critical properties |

### 7.2 IEC 60880 and Formal Methods
- IEC 60880 states objectives for software development rather than prescribing specific techniques
- Formal methods are recognized as a powerful approach to meeting these objectives
- Static analysis tools (e.g., QA-MISRA, Cantata, Trust-in-Soft) help achieve IEC 60880 compliance: https://www.qa-systems.com/blog/iec-60880-compliance-in-nuclear-systems/
- Exhaustive static analysis can slash verification costs: https://www.trust-in-soft.com/resources/blogs/2022-09-29-how-exhaustive-static-analysis-can-slash-software-verification-costs-and-schedule-for-developers-of-safety-and-cybersecurity-critical-systems

### 7.3 Chinese Research in Formal Methods for Nuclear
- ECNU research on formal method and model-driven fusion theory for nuclear safety control software: https://pure.ecnu.edu.cn/en/publications/
- Chinese patent CN104462933A on nuclear safety-grade software V&V methods
- Research on T-S fuzzy fault tree reliability evaluation for nuclear safety-class DCS: https://www.sciencedirect.com/science/article/pii/S1738573323000700

### 7.4 BSI Study on Formal Methods
- German BSI comprehensive survey: "Formal Methods for Safe and Secure Computer Systems"
- https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/Studien/formal_methods_study_875/Summary_formal_methods_study_875.pdf

---

## 8. D3 (Diversity and Defense-in-Depth) Analysis Framework

### 8.1 Regulatory Foundation
The D3 concept originates from:
- **NRC SRM-SECY-93-087**: Policy on defense-in-depth and diversity for digital I&C
- **BTP 7-19** (Branch Technical Position): "Guidance for Evaluation of Defense-in-Depth and Diversity to Address Common Cause Failure Due to Latent Design Defects in Digital Safety Systems"
  - Latest revision: Rev 6 (Federal Register notice May 2024)
  - https://www.nrc.gov/docs/ML1814/ML18145A016.pdf (Rev 5)
  - https://www.nrc.gov/docs/ML1814/ML18145A014.pdf (Rev 6)
  - https://www.federalregister.gov/documents/2024/05/01/2024-09323/

### 8.2 D3 Analysis Process
1. **Identify safety functions** performed by digital I&C systems
2. **Identify CCF vulnerabilities** — latent software defects that could defeat redundancy
3. **Assess existing diversity** using NUREG/CR-6303 attributes
4. **Determine if diverse backup** is needed for each safety function
5. **Verify diverse backup capability** — can it perform the safety function if primary fails?
6. **Document the analysis** and obtain regulatory approval

### 8.3 NRC D3 Guideline
- NUREG document for performing D3 evaluations on digital upgrades
- https://www.nrc.gov/docs/ML0505/ML050540262.pdf
- Examines potential vulnerability to software or other digital system failures

### 8.4 MDEP Common Position
- **MDEP DICWG-01**: "Common Position on the Treatment of Common Cause Failure Caused by Software Within Digital Safety Systems" (June 2013)
- https://www.oecd-nea.org/mdep/common-positions/dicwg-01.pdf
- Multinational consensus on addressing software CCF
- Referenced in CORDEL report on diversity attributes

### 8.5 Quantitative CCF Evaluation
- ScienceDirect: "Quantitative Evaluation of Common Cause Failures in High Safety-Significant DI&C Systems" — methodology for quantitative evaluation of software CCFs
- https://www.sciencedirect.com/science/article/abs/pii/S0951832022005889

---

## 9. Key References & Sources

### Regulatory Documents
1. NUREG/CR-6303 — https://www.nrc.gov/docs/ML0717/ML071790509.pdf
2. NUREG/CR-7007 — https://www.nrc.gov/docs/ML1005/ML100541256.pdf
3. BTP 7-19 Rev 6 — https://www.nrc.gov/docs/ML1814/ML18145A014.pdf
4. NRC D3 Guideline — https://www.nrc.gov/docs/ML0505/ML050540262.pdf
5. IAEA NP-T-1.5 — https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1410_web.pdf
6. IAEA SSG-39 — https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1694_web.pdf
7. IAEA TECDOC 1848 — https://www-pub.iaea.org/MTCD/Publications/PDF/TE1848-web.pdf
8. MDEP DICWG-01 — https://www.oecd-nea.org/mdep/common-positions/dicwg-01.pdf

### Industry Reports
9. CORDEL D3 Report (WNA) — https://world-nuclear.org/images/articles/CORDEL-Defence-in-Depth-Report-10-April.pdf
10. ORNL Diversity Strategies — https://info.ornl.gov/sites/publications/files/Pub22473.pdf
11. ORNL CCF Mitigation — https://info.ornl.gov/sites/publications/Files/Pub47390.pdf
12. ORNL Qualitative CCF Assessment — https://info.ornl.gov/sites/publications/files/Pub62185.pdf
13. EPRI D3 Effects Report — https://www.epri.com/#/pages/product/1019183/
14. Framatome TELEPERM XS — https://www.framatome.com/solutions-portfolio//app/uploads/2025/09/a0628-txs-brochure-a4114afc1928a94254a661d0839821d5d6.pdf

### Academic Papers
15. Knight & Leveson (1986) — http://sunnyday.mit.edu/papers/nver-tse.pdf
16. Eckhardt & Lee (1985) — IEEE TSE, Vol. SE-11, No. 12
17. Hatton (1997) — https://kar.kent.ac.uk/21442/1/N-version_Design_vs._One_Good_Version.pdf
18. Littlewood, Popov, Strigini & Shryane (2000) — https://impact.ref.ac.uk/casestudies/CaseStudy.aspx?Id=44358
19. Strigini & Littlewood (diversity as risk measure) — https://openaccess.city.ac.uk/id/eprint/3226/1/Software%2520diversity%2520as%2520a%2520measure.pdf
20. ACM Survey on Formally Verified Systems — https://dl.acm.org/doi/full/10.1145/3785652

### Implementation References
21. Sizewell B Software Safety — https://ieeexplore.ieee.org/document/172006/
22. Sizewell B SPS Design — https://ieeexplore.ieee.org/document/172010/
23. UK ONR Software Licensing — https://www.onr.org.uk/media/i2anr3nd/24-09-common-position-2024-revision-1.pdf
24. UK ONR TAST-GD-046 — https://www.onr.org.uk/operational/tech_asst_guides/ns-tast-gd-046.pdf
25. AP1000 DAS — https://www.nrc.gov/docs/ML1021/ML102170263.pdf
26. AP1000 D3 Analysis — https://www.nrc.gov/docs/ML0212/ML021220228.pdf
27. EPR I&C Architecture — https://regulation-oversight.asnr.fr/information/news-archives/I-C-architecture-of-the-Flamanville-3-EPR
28. Hualong One Safety — https://www.ifnec.org/ifnec/upload/docs/application/pdf/2018-06/2.t_xin_safety_approach_and_safety_assessment_of_hualong_one_2018-06-08_11-13-28_805.pdf
29. CGN FirmSys — http://en.cgnp.com.cn/encgnp/c100866/2018-05/22/content_4b074fdfad2c4cfda9c15948967ed0eb.shtml
30. NASPIC DCS — https://inis.iaea.org/records/xknhy-9vr81
31. KNS Regulatory Positions — https://www.kns.org/files/pre_paper/41/19S-712-%EC%8B%A0%EC%8A%B9%EA%B8%B0.pdf

### Standards
32. IEC 60880:2006 — https://standards.ieee.org/ieee/60880/12037
33. IEC 60880 compliance tools — https://www.qa-systems.com/blog/iec-60880-compliance-in-nuclear-systems/
34. Swedish SSM licensing document — https://www.stralsakerhetsmyndigheten.se/contentassets/0a01d06106a74a708a3c16c191ebf84d/201308-licensing-of-safety-critical-software-for-nuclear-reactors

---

## Appendix: CORDEL Diversity Attributes Comparison (NUREG/CR-6303 vs NUREG/CR-7007)

| NUREG/CR-6303 Attribute | NUREG/CR-7007 Equivalent | Notes |
|--------------------------|--------------------------|-------|
| Human Diversity | Life-Cycle Diversity | Broadened to cover entire lifecycle |
| Design Diversity | Design Diversity | Unchanged |
| Software Diversity | Logic Diversity | Broadened to cover all programmable devices |
| Functional Diversity | Functional Diversity | Unchanged |
| Signal Diversity | Signal Diversity | Unchanged |
| Equipment Diversity | Equipment Manufacturer + Logic Processing Equipment | Split into two sub-attributes |

---

*Research compiled on 2026-05-26 for Chinese-language nuclear safety I&C software diversity report.*
*All URLs verified as of search date.*
