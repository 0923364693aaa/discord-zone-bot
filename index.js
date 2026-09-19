require("dotenv").config();

const express = require("express");
const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    EmbedBuilder,
    AttachmentBuilder,
    PermissionFlagsBits
} = require("discord.js");

// ===============================
// Web Service
// ===============================

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("Discord Zone Bot is online!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        bot: client.isReady(),
        uptime: process.uptime()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 Web Server running on port ${PORT}`);
});

// ===============================
// Discord Client
// ===============================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// ===============================
// รายชื่อโซน
// ===============================

const regions = {

    "โซนเหนือ": [
        "🍡 зโซนเชียงราย®",
        "🍡 зโซนเชียงใหม่®",
        "🍡 зโซนแม่ฮ่องสอน®",
        "🍡 зโซนพะเยา®",
        "🍡 зโซนน่าน®",
        "🍡 зโซนแพร่®",
        "🍡 зโซนลำปาง®",
        "🍡 зโซนลำพูน®",
        "🍡 зโซนอุตรดิตถ์®"
    ],

    "โซนอีสาน": [
        "🧩 зโซนบึงกาฬ®",
        "🧩 зโซนหนองคาย®",
        "🧩 зโซนเลย®",
        "🧩 зโซนอุดรธานี®",
        "🧩 зโซนหนองบัวลำภู®",
        "🧩 зโซนสกลนคร®",
        "🧩 зโซนนครพนม®",
        "🧩 зโซนมุกดาหาร®",
        "🧩 зโซนกาฬสินธุ์®",
        "🧩 зโซนขอนแก่น®",
        "🧩 зโซนร้อยเอ็ด®",
        "🧩 зโซนมหาสารคาม®",
        "🧩 зโซนชัยภูมิ®",
        "🧩 зโซนยโสธร®",
        "🧩 зโซนอำนาจเจริญ®",
        "🧩 зโซนนครราชสีมา®",
        "🧩 зโซนบุรีรัมย์®",
        "🧩 зโซนสุรินทร์®",
        "🧩 зโซนศรีสะเกษ®",
        "🧩 зโซนอุบลราชธานี®
    ],

    "โซนกลาง": [
        "🔥 зโซนกรุงเทพมหานคร®",
        "🔥 зโซนนครสวรรค์®",
        "🔥 зโซนสุโขทัย®",
        "🔥 зโซนลพบุรี®",
        "🔥 зโซนสิงห์บุรี®",
        "🔥 зโซนอ่างทอง®",
        "🔥 зโซนสระบุรี®",
        "🔥 зโซนพระนครศรีอยุธยา®",
        "🔥 зโซนสุพรรณบุรี®",
        "🔥 зโซนปทุมธานี®",
        "🔥 зโซนนนทบุรี®",
        "🔥 зโซนนครปฐม®",
        "🔥 зโซนสมุทรปราการ®",
        "🔥 зโซนสมุทรสงคราม®",
        "🔥 зโซนสมุทรสาคร®",
        "🔥 зโซนชัยนาท®",
        "🔥 зโซนกำแพงเพชร®",
        "🔥 зโซนนครนายก®",
        "🔥 зโซนพิจิตร®",
        "🔥 зโซนพิษณุโลก®",
        "🔥 зโซนเพชรบูรณ์®",
        "🔥 зโซนอุทัยธานี®"
    ],

    "โซนตะวันออก": [
        "🏹 зโซนฉะเชิงเทรา®",
        "🏹 зโซนตราด®",
        "🏹 зโซนสระแก้ว®",
        "🏹 зโซนปราจีนบุรี®",
        "🏹 зโซนจันทบุรี®",
        "🏹 зโซนชลบุรี®",
        "🏹 зโซนระยอง®"
    ],

    "โซนตะวันตก": [
        "🪸 зโซนตาก®",
        "🪸 зโซนกาญจนบุรี®",
        "🪸 зโซนเพชรบุรี®",
        "🪸 зโซนราชบุรี®",
        "🪸 зโซนประจวบคีรีขันธ์®"
    ],

    "โซนใต้": [
        "🌊 зโซนชุมพร®",
        "🌊 зโซนระนอง®",
        "🌊 зโซนสุราษฎร์ธานี®",
        "🌊 зโซนพังงา®",
        "🌊 зโซนกระบี่®",
        "🌊 зโซนนครศรีธรรมราช®",
        "🌊 зโซนภูเก็ต®",
        "🌊 зโซนตรัง®",
        "🌊 зโซนพัทลุง®",
        "🌊 зโซนสงขลา®",
        "🌊 зโซนสตูล®",
        "🌊 зโซนปัตตานี®",
        "🌊 зโซนยะลา®",
        "🌊 зโซนนราธิวาส®"
    ]
};

const allZones = Object.values(regions).flat();

// ===============================
// หา Role ที่มีอยู่จริง
// ===============================

function getAvailableRegions(guild) {

    const result = {};

    for (const [region, zones] of Object.entries(regions)) {

        const available = zones.filter(zone =>
            guild.roles.cache.some(
                role => role.name === zone
            )
        );

        if (available.length > 0) {
            result[region] = available;
        }
    }

    return result;
}

// ===============================
// Slash Command
// ===============================

const commands = [

    new SlashCommandBuilder()
        .setName("setup-role")
        .setDescription("ติดตั้งระบบรับยศโซน")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

].map(command => command.toJSON());

// ===============================
// Bot Ready
// ===============================

client.once("ready", async () => {

    console.log("=================================");
    console.log(`✅ BOT ONLINE : ${client.user.tag}`);
    console.log("=================================");

    const rest = new REST({
        version: "10"
    }).setToken(process.env.TOKEN);

    try {

        await rest.put(
            Routes.applicationCommands(
                client.user.id
            ),
            {
                body: commands
            }
        );

        console.log(
            "✅ ลงทะเบียน /setup-role สำเร็จ"
        );

    } catch (error) {

        console.error(
            "❌ ลงทะเบียน Command ไม่สำเร็จ:",
            error
        );

    }

});

// ===============================
// Interaction
// ===============================

client.on(
    "interactionCreate",
    async interaction => {

        try {

            // ==========================================
            // /setup-role
            // ==========================================

            if (interaction.isChatInputCommand()) {

                if (
                    interaction.commandName !==
                    "setup-role"
                ) {
                    return;
                }

                if (
                    !interaction.member.permissions.has(
                        PermissionFlagsBits.Administrator
                    )
                ) {

                    return interaction.reply({
                        content:
                            "❌ คุณไม่มีสิทธิ์ใช้คำสั่งนี้",
                        ephemeral: true
                    });

                }

                await interaction.deferReply({
                    ephemeral: true
                });

                const availableRegions =
                    getAvailableRegions(
                        interaction.guild
                    );

                const regionNames =
                    Object.keys(
                        availableRegions
                    );

                if (regionNames.length === 0) {

                    return interaction.editReply({

                        content:
                            "❌ ไม่พบ Role โซนในเซิร์ฟเวอร์"

                    });

                }

                // ==========================================
                // Embed
                // ==========================================

                const embed =
                    new EmbedBuilder()

                        .setTitle(
                            "📢 ระบบเลือกโซนอัตโนมัติ"
                        )

                        .setDescription(
                            "รับยศโซน เพื่อเข้าห้อง\n" +
                            "เลือกโซน | เลือกรับยศโซนของคุณ"
                        )

                        .setColor("#5865F2");

                // ==========================================
                // รูป
                // ==========================================

                const files = [];

                try {

                    const image =
                        new AttachmentBuilder(
                            "./image.webp"
                        );

                    embed.setImage(
                        "attachment://image.webp"
                    );

                    files.push(image);

                } catch {

                    console.log(
                        "⚠️ ไม่พบ image.webp"
                    );

                }

                // ==========================================
                // Emoji ภาค
                // ==========================================

                const regionEmoji = {

                    "โซนเหนือ": "🏔️",

                    "โซนอีสาน": "🌾",

                    "โซนกลาง": "🏙️",

                    "โซนตะวันออก": "🌊",

                    "โซนตะวันตก": "⛰️",

                    "โซนใต้": "🌴"

                };

                // ==========================================
                // เมนูภาค
                // ==========================================

                const regionOptions =
                    regionNames.map(region => {

                        return new StringSelectMenuOptionBuilder()

                            .setLabel(region)

                            .setValue(region)

                            .setEmoji(
                                regionEmoji[region] ||
                                "📍"
                            );

                    });

                const regionMenu =
                    new StringSelectMenuBuilder()

                        .setCustomId(
                            "zone_region"
                        )

                        .setPlaceholder(
                            "🌎 เลือกโซนของคุณ"
                        )

                        .addOptions(
                            regionOptions
                        );

                // ==========================================
                // ปุ่ม Reset
                // ==========================================

                const resetButton =
                    new ButtonBuilder()

                        .setCustomId(
                            "zone_reset"
                        )

                        .setLabel(
                            "รีเซ็ต"
                        )

                        .setEmoji(
                            "🔄"
                        )

                        .setStyle(
                            ButtonStyle.Danger
                        );

                // ==========================================
                // ส่ง Panel
                // ==========================================

                await interaction.channel.send({

                    embeds: [
                        embed
                    ],

                    files,

                    components: [

                        new ActionRowBuilder()
                            .addComponents(
                                regionMenu
                            ),

                        new ActionRowBuilder()
                            .addComponents(
                                resetButton
                            )

                    ]

                });

                // ลบคำตอบคำสั่ง
                await interaction.deleteReply()
                    .catch(() => {});

                console.log(
                    `✅ ติดตั้ง Panel โดย ${interaction.user.tag}`
                );

                return;
            }

            // ==========================================
            // เลือกภาค
            // ==========================================

            if (
                interaction.isStringSelectMenu() &&
                interaction.customId ===
                "zone_region"
            ) {

                await interaction.deferReply({
                    ephemeral: true
                });

                const region =
                    interaction.values[0];

                const availableRegions =
                    getAvailableRegions(
                        interaction.guild
                    );

                const zones =
                    availableRegions[region];

                if (
                    !zones ||
                    zones.length === 0
                ) {

                    return interaction.editReply({

                        content:
                            "❌ ไม่พบโซนในภาคนี้"

                    });

                }

                const displayRegion =
                    region.replace(
                        "โซน",
                        ""
                    );

                // ==========================================
                // เมนูโซน
                // ==========================================

                const zoneOptions =
                    zones.map(zone => {

                        const zoneName =
                            zone.replace(
                                "โซน",
                                ""
                            );

                        return new StringSelectMenuOptionBuilder()

                            .setLabel(
                                zoneName
                            )

                            .setDescription(
                                `รับยศ${zone}`
                            )

                            .setValue(
                                zone
                            )

                            .setEmoji(
                                "📍"
                            );

                    });

                const zoneMenu =
                    new StringSelectMenuBuilder()

                        .setCustomId(
                            "zone_select"
                        )

                        .setPlaceholder(
                            `กรุณาเลือกโซนของคุณใน ภาค${displayRegion}`
                        )

                        .addOptions(
                            zoneOptions
                        );

                await interaction.editReply({

                    content:
                        `📍 **กรุณาเลือกโซนของคุณใน ภาค${displayRegion}**`,

                    components: [

                        new ActionRowBuilder()
                            .addComponents(
                                zoneMenu
                            )

                    ]

                });

                return;
            }

            // ==========================================
            // เลือกโซน / รับยศ
            // ==========================================

            if (
                interaction.isStringSelectMenu() &&
                interaction.customId ===
                "zone_select"
            ) {

                await interaction.deferReply({
                    ephemeral: true
                });

                const zone =
                    interaction.values[0];

                const guild =
                    interaction.guild;

                const member =
                    interaction.member;

                // ==========================================
                // หา Role
                // ==========================================

                const zoneRole =
                    guild.roles.cache.find(
                        role =>
                            role.name === zone
                    );

                if (!zoneRole) {

                    return interaction.editReply({

                        content:
                            `❌ ไม่พบยศ **${zone}**`

                    });

                }

                const botMember =
                    guild.members.me;

                if (!botMember) {

                    return interaction.editReply({

                        content:
                            "❌ ไม่สามารถตรวจสอบ Bot ได้"

                    });

                }

                // ==========================================
                // ตรวจตำแหน่ง Role
                // ==========================================

                if (
                    zoneRole.position >=
                    botMember.roles.highest.position
                ) {

                    return interaction.editReply({

                        content:
                            "❌ Bot ไม่สามารถแจกยศนี้ได้\n\n" +
                            "ให้ลาก Role ของ Bot " +
                            "ไว้เหนือ Role โซนทั้งหมด"

                    });

                }

                // ==========================================
                // ลบยศเก่า
                // ==========================================

                for (
                    const oldZone of allZones
                ) {

                    const oldRole =
                        guild.roles.cache.find(
                            role =>
                                role.name === oldZone
                        );

                    if (
                        oldRole &&
                        oldRole.id !== zoneRole.id &&
                        member.roles.cache.has(
                            oldRole.id
                        )
                    ) {

                        if (
                            oldRole.position <
                            botMember.roles.highest.position
                        ) {

                            try {

                                await member.roles.remove(
                                    oldRole,
                                    "เปลี่ยนโซน"
                                );

                            } catch (error) {

                                console.error(
                                    `❌ ลบ ${oldRole.name} ไม่สำเร็จ`,
                                    error
                                );

                            }

                        }

                    }

                }

                // ==========================================
                // เพิ่มยศใหม่
                // ==========================================

                try {

                    if (
                        !member.roles.cache.has(
                            zoneRole.id
                        )
                    ) {

                        await member.roles.add(
                            zoneRole,
                            "รับยศโซน"
                        );

                    }

                } catch (error) {

                    console.error(
                        "❌ เพิ่ม Role ไม่สำเร็จ:",
                        error
                    );

                    return interaction.editReply({

                        content:
                            "❌ ไม่สามารถรับยศได้\n\n" +
                            "ตรวจสอบสิทธิ์ Manage Roles " +
                            "และตำแหน่ง Role ของ Bot"

                    });

                }

                // ==========================================
                // สำเร็จ
                // ==========================================

                await interaction.editReply({

                    content:
                        `✅ **คุณได้รับยศ ${zone} เรียบร้อยแล้ว!**`,

                    components: []

                });

                console.log(
                    `✅ ${member.user.tag} → ${zone}`
                );

                return;
            }

            // ==========================================
            // Reset
            // ==========================================

            if (
                interaction.isButton() &&
                interaction.customId ===
                "zone_reset"
            ) {

                await interaction.deferReply({
                    ephemeral: true
                });

                const guild =
                    interaction.guild;

                const member =
                    interaction.member;

                const botMember =
                    guild.members.me;

                if (!botMember) {

                    return interaction.editReply({

                        content:
                            "❌ ไม่สามารถตรวจสอบ Bot ได้"

                    });

                }

                // ==========================================
                // ลบยศโซนทั้งหมด
                // ==========================================

                for (
                    const zone of allZones
                ) {

                    const role =
                        guild.roles.cache.find(
                            r =>
                                r.name === zone
                        );

                    if (
                        role &&
                        member.roles.cache.has(
                            role.id
                        )
                    ) {

                        if (
                            role.position <
                            botMember.roles.highest.position
                        ) {

                            try {

                                await member.roles.remove(
                                    role,
                                    "รีเซ็ตยศโซน"
                                );

                            } catch (error) {

                                console.error(
                                    `❌ ลบ ${role.name} ไม่สำเร็จ`,
                                    error
                                );

                            }

                        }

                    }

                }

                await interaction.editReply({

                    content:
                        "🔄 **รีเซ็ตยศโซนสำเร็จ!**"

                });

                console.log(
                    `🔄 ${member.user.tag} รีเซ็ตยศโซน`
                );

                return;
            }

        } catch (error) {

            console.error(
                "❌ Interaction Error:",
                error
            );

            try {

                if (
                    interaction.deferred ||
                    interaction.replied
                ) {

                    await interaction.editReply({

                        content:
                            "❌ เกิดข้อผิดพลาด กรุณาลองใหม่"

                    });

                } else {

                    await interaction.reply({

                        content:
                            "❌ เกิดข้อผิดพลาด กรุณาลองใหม่",

                        ephemeral: true

                    });

                }

            } catch {}

        }

    }
);

// ===============================
// Login
// ===============================

if (!process.env.TOKEN) {

    console.error(
        "❌ ไม่พบ TOKEN ใน Environment Variables"
    );

    process.exit(1);
}

client.login(process.env.TOKEN);
