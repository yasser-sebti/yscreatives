/**
 * Discord Dispatcher Utility
 * Handles lead delivery to Discord via Webhooks with visual embedding.
 */

const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

/**
 * Sends form data to Discord as a formatted embed.
 * @param {Object} lead - The processed lead data (form inputs + enriched metadata).
 */
export const sendToDiscord = async (lead) => {
    if (!DISCORD_WEBHOOK_URL) {
        console.error("Discord Webhook URL is missing from environment variables.");
        return { success: false, error: "Configuration Error" };
    }

    const payload = {
        embeds: [
            {
                title: "🚀 New Project Inquiry",
                description: "A potential client has reached out through the Yasser Creatives portal.",
                color: 0, // Void Black
                fields: [
                    { name: "👤 Client Name", value: lead.name || "N/A", inline: true },
                    { name: "🏢 Company", value: lead.company || "N/A", inline: true },
                    { name: "📧 Email", value: lead.email || "N/A", inline: false },
                    { name: "📞 Phone", value: lead.phone || "N/A", inline: true },
                    { name: "📍 Country", value: lead.country || "N/A", inline: true },
                    { name: "🛠️ Service", value: lead.service || "N/A", inline: true },
                    { name: "💰 Budget", value: lead.budget || "N/A", inline: true },
                    { name: "📣 Referral", value: lead.referral || "N/A", inline: true },
                    { name: "💬 Message", value: lead.message || "No additional message.", inline: false },
                    {
                        name: "🌐 Technical Intelligence",
                        value: `**IP Address:** \`${lead.ip}\`\n**Location:** \`${lead.location}\`\n**Local Time:** \`${lead.localTime}\` (${lead.timezone})`,
                        inline: false
                    }
                ],
                footer: {
                    text: "Yasser Creatives • Lead Intelligence System",
                    icon_url: "https://yscreatives.com/favicon.png" // Placeholder or actual logo URL
                },
                timestamp: new Date().toISOString()
            }
        ]
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Discord API responded with status ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to send lead to Discord:", error);
        return { success: false, error: error.message };
    }
};
