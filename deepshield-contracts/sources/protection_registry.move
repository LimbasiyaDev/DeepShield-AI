module deepshield_ai::protection_registry {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::String;

    /// Store protected trade records.
    public struct ProtectionRecord has key, store {
        id: UID,
        owner: address,
        pair: String,
        strategy: String,
        estimated_savings: String,
        actual_savings: String,
        walrus_blob_id: String,
        created_at: u64,
    }

    public struct ProtectionRecorded has copy, drop {
        record_id: object::ID,
        owner: address,
        pair: String,
        walrus_blob_id: String,
    }

    public fun record_protection(
        recipient: address,
        pair: String,
        strategy: String,
        estimated_savings: String,
        actual_savings: String,
        walrus_blob_id: String,
        clock_timestamp: u64,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);

        event::emit(ProtectionRecorded {
            record_id: object::uid_to_inner(&id),
            owner: recipient,
            pair,
            walrus_blob_id,
        });

        let record = ProtectionRecord {
            id,
            owner: recipient,
            pair,
            strategy,
            estimated_savings,
            actual_savings,
            walrus_blob_id,
            created_at: clock_timestamp,
        };

        transfer::transfer(record, recipient);
    }

    public fun update_protection(
        record: &mut ProtectionRecord,
        strategy: String,
        estimated_savings: String,
        actual_savings: String,
        walrus_blob_id: String,
        clock_timestamp: u64,
        ctx: &TxContext
    ) {
        assert!(record.owner == tx_context::sender(ctx), 0);
        record.strategy = strategy;
        record.estimated_savings = estimated_savings;
        record.actual_savings = actual_savings;
        record.walrus_blob_id = walrus_blob_id;
        record.created_at = clock_timestamp;
    }

    public fun get_protection(record: &ProtectionRecord): (String, String, String, String, String, u64) {
        (
            record.pair,
            record.strategy,
            record.estimated_savings,
            record.actual_savings,
            record.walrus_blob_id,
            record.created_at
        )
    }
}
