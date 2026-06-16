module deepshield_ai::market_intelligence {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::String;

    /// Store AI market intelligence references.
    public struct MarketIntelligence has key, store {
        id: UID,
        owner: address,
        token: String,
        sentiment: String,
        confidence: u8,
        walrus_blob_id: String,
        created_at: u64,
    }

    public struct IntelligenceSaved has copy, drop {
        record_id: object::ID,
        owner: address,
        token: String,
        walrus_blob_id: String,
    }

    public fun save_analysis(
        recipient: address,
        token: String,
        sentiment: String,
        confidence: u8,
        walrus_blob_id: String,
        clock_timestamp: u64,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);

        event::emit(IntelligenceSaved {
            record_id: object::uid_to_inner(&id),
            owner: recipient,
            token,
            walrus_blob_id,
        });

        let intel = MarketIntelligence {
            id,
            owner: recipient,
            token,
            sentiment,
            confidence,
            walrus_blob_id,
            created_at: clock_timestamp,
        };

        // Transfer to the requested recipient.
        transfer::transfer(intel, recipient);
    }

    public fun get_analysis(intel: &MarketIntelligence): (String, String, u8, String, u64) {
        (
            intel.token,
            intel.sentiment,
            intel.confidence,
            intel.walrus_blob_id,
            intel.created_at
        )
    }
}
