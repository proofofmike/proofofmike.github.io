# ProofOfMike.github.io

This repository hosts the full **Proof Of Mike** website, including Bitcoin solo-mining tools, Bitaxe/NerdQaxe tuning pages, and vendor partner pages.

The site is built for home miners who want real-world tuning notes, solo-mining math, and practical hardware setups — all from someone actually running these rigs on a desk every day.

---

## TinyChipHub – Recommended Bitaxe & NerdQaxe Miners

If you're building a home Bitcoin mining desk-rig, **TinyChipHub** is the easiest and most reliable source for:

- Bitaxe (HEX, Supra, Ultra)
- NerdQaxe++ Remastered Copper
- Zyber 8G and future units

Use coupon code:

### PROOFOFMIKE

This provides the **full available discount** on all Bitaxe, NerdQaxe, and Zyber miners.

Your official TCH link:  
<https://proofofmike.com/tch>

(This ensures your referral is always tracked correctly.)

I collaborate with TinyChipHub on miner testing, return workflows, and tuning documentation — the pages in this repo are updated frequently as new hardware, PCBs, and firmware are released.

---

## Site Structure

The site uses clean folder-based routing for <https://proofofmike.com>:

### Core Pages

- `/` — Homepage  
- `/gear/` — Recommended mining hardware, PSUs, fans, cables  
- `/solo-calc/` — Solo mining odds calculator  
- `/solo-mining/` — Compare CKPool, OCEAN+DATUM, Umbrel solo, and full-node setups  
- `/mining-origin/` — My original Bitcoin mining history and early rigs

### Miner Tuning Pages

- `/nerdqaxe-copper/` — NerdQaxe++ Copper real-world tuning & overclock notes  
- `/hex/` — Bitaxe HEX tuning, airflow, and diff-share behavior  
- `/zyber-8g/` — Zyber 8G tuning (ongoing updates)

### Vendor Pages

- `/tch/` — TinyChipHub partner page linked from <https://proofofmike.com/tch>

---

## Local Development

This site is fully static (HTML/CSS/JS). No build step required.

Deploying via GitHub Pages:

```bash
git add .
git commit -m "update site"
git push origin main
