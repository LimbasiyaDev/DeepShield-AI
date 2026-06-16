module deepshield_ai::portfolio_registry {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::String;

    /// Store portfolio protection references.
    public struct PortfolioAnalysis has key, store {
        id: UID,
        owner: address,
        wallet: String,
        score: u64,
        risk_level: String,
        walrus_blob_id: String,
        created_at: u64,
    }

    public struct PortfolioSaved has copy, drop {
        record_id: object::ID,
        owner: address,
        wallet: String,
        walrus_blob_id: String,
    }

    public fun save_portfolio(
        recipient: address,
        wallet: String,
        score: u64,
        risk_level: String,
        walrus_blob_id: String,
        clock_timestamp: u64,
        ctx: &mut TxContext
    ) {
        let id = object::new(ctx);

        event::emit(PortfolioSaved {
            record_id: object::uid_to_inner(&id),
            owner: recipient,
            wallet,
            walrus_blob_id,
        });

        let portfolio = PortfolioAnalysis {
            id,
            owner: recipient,
            wallet,
            score,
            risk_level,
            walrus_blob_id,
            created_at: clock_timestamp,
        };

        transfer::transfer(portfolio, recipient);
    }

    public fun get_portfolio(portfolio: &PortfolioAnalysis): (String, u64, String, String, u64) {
        (
            portfolio.wallet,
            portfolio.score,
            portfolio.risk_level,
            portfolio.walrus_blob_id,
            portfolio.created_at
        )
    }
}
