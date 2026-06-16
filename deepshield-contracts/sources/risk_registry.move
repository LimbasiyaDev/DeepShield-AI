module deepshield_ai::risk_registry {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::String;

    /// Stores AI risk report references.
    public struct RiskReport has key, store {
        id: UID,
        owner: address,
        token_pair: String,
        risk_score: u8,
        recommendation: String,
        walrus_blob_id: String,
        created_at: u64,
    }

    /// Event emitted when a risk report is created
    public struct RiskReportCreated has copy, drop {
        report_id: object::ID,
        owner: address,
        token_pair: String,
        walrus_blob_id: String,
    }

    public fun create_risk_report(
        recipient: address,
        token_pair: String,
        risk_score: u8,
        recommendation: String,
        walrus_blob_id: String,
        clock_timestamp: u64,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);
        
        event::emit(RiskReportCreated {
            report_id: object::uid_to_inner(&id),
            owner: recipient,
            token_pair,
            walrus_blob_id,
        });

        let report = RiskReport {
            id,
            owner: recipient,
            token_pair,
            risk_score,
            recommendation,
            walrus_blob_id,
            created_at: clock_timestamp,
        };

        transfer::transfer(report, recipient);
    }

    public fun update_risk_report(
        report: &mut RiskReport,
        risk_score: u8,
        recommendation: String,
        walrus_blob_id: String,
        clock_timestamp: u64,
        ctx: &TxContext
    ) {
        assert!(report.owner == tx_context::sender(ctx), 0);
        report.risk_score = risk_score;
        report.recommendation = recommendation;
        report.walrus_blob_id = walrus_blob_id;
        report.created_at = clock_timestamp;
    }

    public fun get_risk_report(report: &RiskReport): (String, u8, String, String, u64) {
        (report.token_pair, report.risk_score, report.recommendation, report.walrus_blob_id, report.created_at)
    }
}
