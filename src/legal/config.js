import termsContent from "./content/terms-of-service.md?raw";
import privacyContent from "./content/privacy-policy.md?raw";
import refundContent from "./content/refund-policy.md?raw";
import tokushoContent from "./content/specified-commercial-transaction.md?raw";

export const legalDocs = {
	terms: {
		key: "terms",
		title: "利用規約",
		description:
			"Discord メンバーシップの利用条件、禁止事項、自動更新、責任範囲を定義します。",
		updatedAt: "2025-12-21",
		effectiveAt: "2025-12-21",
		path: "/legal/terms",
		content: termsContent,
	},
	privacy: {
		key: "privacy",
		title: "プライバシーポリシー",
		description:
			"取得する情報、利用目的、第三者提供、保存期間、Cookie/国外移転、権利行使手続きを明示します。",
		updatedAt: "2025-12-21",
		effectiveAt: "2025-12-21",
		path: "/legal/privacy",
		content: privacyContent,
	},
	refund: {
		key: "refund",
		title: "返金ポリシー",
		description:
			"返金可否・例外、申請手続、プラン変更精算、チャージバック対応を定めます。",
		updatedAt: "2025-12-21",
		effectiveAt: "2025-12-21",
		path: "/legal/refund",
		content: refundContent,
	},
	tokusho: {
		key: "tokusho",
		title: "特定商取引法に基づく表記",
		description:
			"事業者情報、役務の対価、支払時期・方法、提供時期、返品・キャンセル等の条件を記載します。",
		updatedAt: "2025-12-21",
		effectiveAt: "2025-12-21",
		path: "/legal/tokusho",
		content: tokushoContent,
	},
};

export const legalDocList = Object.values(legalDocs);
