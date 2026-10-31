# 🌐 ONDC (Beckn Protocol) Architecture Specification

This specification outlines how **DeshDarshan AI (देशदर्शन)** integrates with the **Open Network for Digital Commerce (ONDC)** using the open **Beckn Protocol** to disintermediate tourism bookings and inject wealth directly into rural village economies.

---

## 🎯 The Economic Challenge
Conventional Online Travel Agencies (OTAs):
- Extract **25% to 38%** in aggregator fees and commissions.
- Lock small rural homestays, GI-certified handloom weavers, and local guides out due to onerous onboarding requirements.
- Concentrate 90% of bookings into the top 1% of saturated commercial hotels in congested towns.

### The DeshDarshan ONDC Solution:
- Decentralized open protocol architecture (BAP $\leftrightarrow$ Gateway $\leftrightarrow$ BPP).
- **Direct host revenue retention: 96%** (only 4% operational network clearing).
- Open discovery where small rural homestays within a 30 km radius of saturated hubs are surfaced automatically.

---

## 🔄 Protocol Interaction Cycle

```
[Tourist / DeshDarshan BAP]
          │
          │ 1. /search (Intent: destination, date, capacity)
          ▼
   [ONDC Beckn Gateway]
          │
          │ 2. Broadcasts search to regional BPPs
          ▼
 [Rural Host BPP Nodes] (Homestays, Farmstays, Handloom Cooperatives)
          │
          │ 3. /on_search (Returns catalog, availability, fair pricing)
          ▼
   [ONDC Beckn Gateway]
          │
          │ 4. Aggregated response delivered
          ▼
[Tourist / DeshDarshan BAP]
          │
          │ 5. /select (Select specific room/artisan tour)
          │ 6. /init (Initialize quote, taxes, DeshCredits discount)
          │ 7. /confirm (Finalize booking with UPI escrow)
          ▼
 [Rural Host BPP Nodes]
          │
          │ 8. Cryptographic booking confirmation & direct payout
          ▼
[Completed & Registered on State Tourism Ledger]
```

---

## 📋 JSON Schema Examples

### 1. DeshDarshan BAP Discovery Request (`/search`)
```json
{
  "context": {
    "domain": "nic2004:55101",
    "country": "IND",
    "city": "std:0177",
    "action": "search",
    "core_version": "1.1.0",
    "bap_id": "deshdarshan-ai.gov.in",
    "bap_uri": "https://deshdarshan-ai.gov.in/beckn/bap",
    "transaction_id": "tx-dd-20261031-89324",
    "message_id": "msg-001-9238",
    "timestamp": "2026-10-31T10:30:00Z"
  },
  "message": {
    "intent": {
      "item": {
        "descriptor": {
          "name": "Eco Homestay / Rural Heritage Experience"
        }
      },
      "fulfillment": {
        "end": {
          "location": {
            "gps": "31.2562,77.4241",
            "radius": {
              "value": "30",
              "unit": "km"
            }
          }
        }
      },
      "tags": {
        "sustainability_verified": true,
        "max_capacity_pct": 50
      }
    }
  }
}
```

### 2. Rural Host BPP Catalog Response (`/on_search`)
```json
{
  "context": {
    "domain": "nic2004:55101",
    "action": "on_search",
    "bpp_id": "narkanda-rural-collective.bpp.ondc.org",
    "bpp_uri": "https://narkanda.bpp.ondc.org/beckn",
    "transaction_id": "tx-dd-20261031-89324"
  },
  "message": {
    "catalog": {
      "bpp/descriptor": {
        "name": "Narkanda Apple Valley Rural Collective"
      },
      "bpp/providers": [
        {
          "id": "provider-narkanda-01",
          "descriptor": {
            "name": "Thakur 100yr Apple Farmstay",
            "images": ["/assets/homestays/narkanda-farm.jpg"]
          },
          "items": [
            {
              "id": "room-heritage-01",
              "descriptor": {
                "name": "Traditional Deodar Wood Suite with Valley View"
              },
              "price": {
                "currency": "INR",
                "value": "2400.00"
              },
              "tags": {
                "direct_host_payout": "96%",
                "gi_handloom_gift": true,
                "deshcredits_accepted": 500
              }
            }
          ]
        }
      ]
    }
  }
}
```

---

## 🔒 Cryptographic Settlement & Escrow
- **Settlement Type**: Instant UPI 2.0 AutoSplit via RBI-approved payment rails.
- **Fair Split Guarantee**:
  - $96\%$ credited directly to the rural host's Jan Dhan / Merchant UPI ID.
  - $4\%$ allocated for open network transit, insurance, and municipal green cess.
- Every transaction produces a verifiable cryptographic hash stored on the municipal state tourism ledger.
