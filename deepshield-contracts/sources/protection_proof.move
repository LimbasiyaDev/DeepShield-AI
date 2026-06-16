module deepshield_ai::protection_proof {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::String;

    /// Store verifiable proof that DeepShield protected a trade.
    public struct ProtectionProof has key, store {
        id: UID,
        owner: address,
        trade_pair: String,
        risk_score: u8,
        strategy: String,
        estimated_savings: String,
        blob_id: String,
        timestamp: u64,
    }

    public struct ProofCreated has copy, drop {
        proof_id: object::ID,
        owner: address,
        trade_pair: String,
        blob_id: String,
    }

    public fun create_proof(
        recipient: address,
        trade_pair: String,
        risk_score: u8,
        strategy: String,
        estimated_savings: String,
        blob_id: String,
        clock_timestamp: u64,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);

        event::emit(ProofCreated {
            proof_id: object::uid_to_inner(&id),
            owner: recipient,
            trade_pair,
            blob_id,
        });

        let proof = ProtectionProof {
            id,
            owner: recipient,
            trade_pair,
            risk_score,
            strategy,
            estimated_savings,
            blob_id,
            timestamp: clock_timestamp,
        };

        transfer::transfer(proof, recipient);
    }

    public fun get_proof(proof: &ProtectionProof): (String, u8, String, String, String, u64) {
        (
            proof.trade_pair,
            proof.risk_score,
            proof.strategy,
            proof.estimated_savings,
            proof.blob_id,
            proof.timestamp
        )
    }

    public fun update_proof(
        proof: &mut ProtectionProof,
        risk_score: u8,
        strategy: String,
        estimated_savings: String,
        blob_id: String,
        clock_timestamp: u64,
        ctx: &TxContext
    ) {
        assert!(proof.owner == tx_context::sender(ctx), 0);
        proof.risk_score = risk_score;
        proof.strategy = strategy;
        proof.estimated_savings = estimated_savings;
        proof.blob_id = blob_id;
        proof.timestamp = clock_timestamp;
    }
}
