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

const fs = require("fs");

// =====================================================
// Discord Client
// =====================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// =====================================================
// Render Web Service
// =====================================================

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

// =====================================================
// รายชื่อยศทั้งหมด
// =====================================================

const regions = {

    // =================================================
    // โซนเหนือ
    // =================================================

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

    // =================================================
    // โซนอีสาน
    // =================================================

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
        "🧩 зโซนอุบลราชธานี®"
    ],

    // =================================================
    // โซนกลาง
    // =================================================

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

    // =================================================
    // โซนตะวันออก
    // =================================================

    "โซนตะวันออก": [
        "🏹 зโซนฉะเชิงเทรา®",
        "🏹 зโซนตราด®",
        "🏹 зโซนสระแก้ว®",
        "🏹 зโซนปราจีนบุรี®",
        "🏹 зโซนจันทบุรี®",
        "🏹 зโซนชลบุรี®",
        "🏹 зโซนระยอง®"
    ],

    // =================================================
    // โซนตะวันตก
    // =================================================

    "โซนตะวันตก": [
        "🪸 зโซนตาก®",
        "🪸 зโซนกาญจนบุรี®",
        "🪸 зโซนเพชรบุรี®",
        "🪸 зโซนราชบุรี®",
        "🪸 зโซนประจวบคีรีขันธ์®"
    ],

    // =================================================
    // โซนใต้ - ครบทั้งหมด
    // =================================================

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

// =====================================================
// รวมยศทุกโซน
// =====================================================

const allZones = Object.values(regions).flat();

// =====================================================
// Emoji หน้าเมนู
// =====================================================

const regionEmoji = {
    "โซนเหนือ": "🏔️",
    "โซนอีสาน": "🌾",
    "โซนกลาง": "🏙️",
    "โซนตะวันออก": "🌊",
    "โซนตะวันตก": "⛰️",
    "โซนใต้": "🌴"
};

// =====================================================
// แปลงชื่อยศให้แสดงเฉพาะชื่อพื้นที่
// =====================================================

function getDisplayZoneName(zone) {

    return zone
        .replace(/^🍡\sзโซน/, "")
        .replace(/^🧩\sзโซน/, "")
        .replace(/^🔥\sзโซน/, "")
        .replace(/^🏹\sзโซน/, "")
        .replace(/^🪸\sзโซน/, "")
        .replace(/^🌊\sзโซน/, "")
        .replace(/®$/, "")
        .trim();

}

// =====================================================
// Slash Command
// =====================================================

const commands = [

    new SlashCommandBuilder()
        .setName("setup-role")
        .setDescription("ติดตั้งระบบรับยศโซน")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

].map(command => command.toJSON());

// =====================================================
// Bot Ready
// =====================================================

client.once("ready", async () => {

    console.log("=================================");
    console.log(`✅ BOT ONLINE : ${client.user.tag}`);
    console.log("=================================");

    const rest = new REST({
        version: "10"
    }).setToken(
        process.env.TOKEN
    );

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

// =====================================================
// Interaction
// =====================================================

client.on(
    "interactionCreate",
    async interaction => {

        try {

            // =================================================
            // /setup-role
            // =================================================

            if (interaction.isChatInputCommand()) {

                if (
                    interaction.commandName !==
                    "setup-role"
                ) {
                    return;
                }

                // ตรวจ Administrator

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

                // =================================================
                // แสดงครบทั้ง 6 โซน
                // =================================================

                const regionNames =
                    Object.keys(regions);

                // =================================================
                // Embed
                // =================================================

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

                // =================================================
                // รูปภาพ
                // =================================================

                const files = [];

                if (
                    fs.existsSync("./image.webp")
                ) {

                    const image =
                        new AttachmentBuilder(
                            "./image.webp"
                        );

                    embed.setImage(
                        "attachment://image.webp"
                    );

                    files.push(image);

                } else {

                    console.log(
                        "⚠️ ไม่พบ image.webp"
                    );

                }

                // =================================================
                // Menu 6 โซน
                // =================================================

                const regionOptions =
                    regionNames.map(region => {

                        return new StringSelectMenuOptionBuilder()

                            .setLabel(
                                region
                            )

                            .setValue(
                                region
                            )

                            .setEmoji(
                                regionEmoji[region]
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

                // =================================================
                // Reset Button
                // =================================================

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

                // =================================================
                // ส่ง Panel
                // =================================================

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

                // ลบคำสั่ง /setup-role

                await interaction.deleteReply()
                    .catch(() => {});

                console.log(
                    `✅ ติดตั้ง Panel โดย ${interaction.user.tag}`
                );

                return;
            }

            // =================================================
            // เลือกโซน
            // =================================================

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

                // =================================================
                // ใช้รายชื่อทั้งหมด
                // ไม่ตัด Role ที่ยังไม่มี
                // =================================================

                const zones =
                    regions[region];

                if (
                    !zones ||
                    zones.length === 0
                ) {

                    return interaction.editReply({

                        content:
                            "❌ ไม่พบข้อมูลโซนนี้"

                    });

                }

                // =================================================
                // ชื่อโซน
                // =================================================

                const displayRegion =
                    region.replace(
                        "โซน",
                        ""
                    );

                // =================================================
                // สร้างรายการยศทั้งหมด
                // =================================================

                const zoneOptions =
                    zones.map(zone => {

                        const zoneName =
                            getDisplayZoneName(
                                zone
                            );

                        return new StringSelectMenuOptionBuilder()

                            .setLabel(
                                zoneName
                            )

                            .setDescription(
                                `รับยศ ${zoneName}`
                            )

                            .setValue(
                                zone
                            )

                            .setEmoji(
                                "📍"
                            );

                    });

                // =================================================
                // Menu ยศ
                // =================================================

                const zoneMenu =
                    new StringSelectMenuBuilder()

                        .setCustomId(
                            "zone_select"
                        )

                        .setPlaceholder(
                            `📍 เลือกยศในโซน${displayRegion}`
                        )

                        .addOptions(
                            zoneOptions
                        );

                // =================================================
                // ส่งเมนู
                // =================================================

                await interaction.editReply({

                    content:
                        `📍 **กรุณาเลือกยศของคุณในโซน${displayRegion}**`,

                    components: [

                        new ActionRowBuilder()
                            .addComponents(
                                zoneMenu
                            )

                    ]

                });

                return;
            }

            // =================================================
            // เลือกยศ / รับ Role
            // =================================================

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

                // =================================================
                // หา Role จริงใน Discord
                // =================================================

                const zoneRole =
                    guild.roles.cache.find(
                        role =>
                            role.name === zone
                    );

                if (!zoneRole) {

                    return interaction.editReply({

                        content:
                            `❌ ไม่พบยศ **${getDisplayZoneName(zone)}** ในเซิร์ฟเวอร์`

                    });

                }

                // =================================================
                // Bot Member
                // =================================================

                const botMember =
                    guild.members.me;

                if (!botMember) {

                    return interaction.editReply({

                        content:
                            "❌ ไม่สามารถตรวจสอบ Bot ได้"

                    });

                }

                // =================================================
                // ตรวจ Manage Roles
                // =================================================

                if (
                    !botMember.permissions.has(
                        PermissionFlagsBits.ManageRoles
                    )
                ) {

                    return interaction.editReply({

                        content:
                            "❌ Bot ไม่มีสิทธิ์ Manage Roles"

                    });

                }

                // =================================================
                // ตรวจตำแหน่ง Role
                // =================================================

                if (
                    zoneRole.position >=
                    botMember.roles.highest.position
                ) {

                    return interaction.editReply({

                        content:
                            "❌ Bot ไม่สามารถแจกยศนี้ได้\n\n" +
                            "กรุณาลาก Role ของ Bot " +
                            "ไว้เหนือ Role โซนทั้งหมด"

                    });

                }

                // =================================================
                // ลบยศโซนเก่าทั้งหมด
                // =================================================

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
                                    "เปลี่ยนยศโซน"
                                );

                                console.log(
                                    `🗑️ ลบ ${oldRole.name} จาก ${member.user.tag}`
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

                // =================================================
                // เพิ่มยศใหม่
                // =================================================

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

                // =================================================
                // สำเร็จ
                // =================================================

                const displayZone =
                    getDisplayZoneName(
                        zone
                    );

                await interaction.editReply({

                    content:
                        `✅ **คุณได้รับยศ ${displayZone} เรียบร้อยแล้ว!**`,

                    components: []

                });

                console.log(
                    `✅ ${member.user.tag} → ${zone}`
                );

                return;
            }

            // =================================================
            // Reset
            // =================================================

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

                // =================================================
                // ตรวจ Manage Roles
                // =================================================

                if (
                    !botMember.permissions.has(
                        PermissionFlagsBits.ManageRoles
                    )
                ) {

                    return interaction.editReply({

                        content:
                            "❌ Bot ไม่มีสิทธิ์ Manage Roles"

                    });

                }

                // =================================================
                // ลบยศทั้งหมด
                // =================================================

                let removed = 0;

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

                                removed++;

                            } catch (error) {

                                console.error(
                                    `❌ ลบ ${role.name} ไม่สำเร็จ`,
                                    error
                                );

                            }

                        }

                    }

                }

                // =================================================
                // แจ้งผล
                // =================================================

                if (removed === 0) {

                    await interaction.editReply({

                        content:
                            "🔄 **คุณไม่มียศโซนที่ต้องรีเซ็ต**"

                    });

                } else {

                    await interaction.editReply({

                        content:
                            "🔄 **รีเซ็ตยศโซนสำเร็จ!**"

                    });

                }

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

// =====================================================
// ตรวจ TOKEN
// =====================================================

if (!process.env.TOKEN) {

    console.error(
        "❌ ไม่พบ TOKEN ใน Environment Variables"
    );

    process.exit(1);

}

// =====================================================
// Login
// =====================================================

client.login(
    process.env.TOKEN
);
