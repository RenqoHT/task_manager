import { prisma } from "@/lib/prisma";
// import { hashSync } from "bcrypt";

async function up() {
    await prisma.user.createMany({
        data: [
            {
                user_login: "Artem69",
                user_password: '676767',
                user_role: "smm"
            },
            {
                user_login: "DimaDev",
                user_password: 'pussy69',
                user_role: "admin"
            },
            {
                user_login: "AnnaWeb",
                user_password: 'anna2026',
                user_role: "moderator"
            },
            {
                user_login: "IvanSQL",
                user_password: 'sqlpro1',
                user_role: "developer"
            },
            {
                user_login: "MariaDesign",
                user_password: 'design88',
                user_role: "designer"
            },
            {
                user_login: "AlexContent",
                user_password: 'content99',
                user_role: "content_manager"
            },
            {
                user_login: "KateSupport",
                user_password: 'support24',
                user_role: "support"
            }
        ]
    });

    await prisma.post.createMany({
        data: [
            {
                post_title: "Поздравление на Новый год",
                post_description: "Создать новогодний ролик формата 16:9",
                post_needs_video_smm: false,
                post_needs_video_maker: true,
                post_needs_text: true,
                post_needs_photogallery: false,
                post_needs_cover_photo: true,
                post_needs_photo_cards: false,
                post_deadline: "16.02.2026",
                post_type: "Видео",
                post_status: "В работе"
            },
            {
                post_title: "Рекламный баннер для сайта",
                post_description: "Дизайн обложки 1920x1080 с анимацией",
                post_needs_video_smm: false,
                post_needs_video_maker: false,
                post_needs_text: true,
                post_needs_photogallery: true,
                post_needs_cover_photo: true,
                post_needs_photo_cards: true,
                post_deadline: "20.02.2026",
                post_type: "Фото",
                post_status: "Готово"
            },
            {
                post_title: "SMM посты на неделю",
                post_description: "10 сторис для Instagram + тексты",
                post_needs_video_smm: true,
                post_needs_video_maker: false,
                post_needs_text: true,
                post_needs_photogallery: false,
                post_needs_cover_photo: false,
                post_needs_photo_cards: true,
                post_deadline: "18.02.2026",
                post_type: "SMM",
                post_status: "В работе"
            },
            {
                post_title: "Корпоративный ролик",
                post_description: "Видео о компании длительностью 2 минуты",
                post_needs_video_smm: false,
                post_needs_video_maker: true,
                post_needs_text: true,
                post_needs_photogallery: true,
                post_needs_cover_photo: true,
                post_needs_photo_cards: false,
                post_deadline: "25.02.2026",
                post_type: "Видео",
                post_status: "В работе"
            },
            {
                post_title: "Фото для каталога",
                post_description: "Обработка 50 фотографий товаров",
                post_needs_video_smm: false,
                post_needs_video_maker: false,
                post_needs_text: false,
                post_needs_photogallery: true,
                post_needs_cover_photo: true,
                post_needs_photo_cards: false,
                post_deadline: "14.02.2026",
                post_type: "Фото",
                post_status: "Готово"
            },
            {
                post_title: "14 февраля - акция",
                post_description: "Видео-приветствие + сторис для соцсетей",
                post_needs_video_smm: true,
                post_needs_video_maker: true,
                post_needs_text: true,
                post_needs_photogallery: false,
                post_needs_cover_photo: true,
                post_needs_photo_cards: true,
                post_deadline: "13.02.2026",
                post_type: "Афиша",
                post_status: "В работе"
            },
            {
                post_title: "Текст для лендинга",
                post_description: "Написать продающий текст 2000 символов",
                post_needs_video_smm: false,
                post_needs_video_maker: false,
                post_needs_text: true,
                post_needs_photogallery: false,
                post_needs_cover_photo: false,
                post_needs_photo_cards: false,
                post_deadline: "17.02.2026",
                post_type: "Текст",
                post_status: "Готово"
            },
            {
                post_title: "Обложка для YouTube",
                post_description: "Дизайн 5 обложек для видео канала",
                post_needs_video_smm: false,
                post_needs_video_maker: false,
                post_needs_text: true,
                post_needs_photogallery: false,
                post_needs_cover_photo: true,
                post_needs_photo_cards: true,
                post_deadline: "19.02.2026",
                post_type: "Дизайн",
                post_status: "В работе"
            },
            {
                post_title: "Галерея для сайта",
                post_description: "Подготовить 20 фото для портфолио",
                post_needs_video_smm: false,
                post_needs_video_maker: false,
                post_needs_text: false,
                post_needs_photogallery: true,
                post_needs_cover_photo: true,
                post_needs_photo_cards: true,
                post_deadline: "15.02.2026",
                post_type: "Фото",
                post_status: "Готово"
            },
            {
                post_title: "Промо сторис",
                post_description: "5 коротких видео для Instagram Stories",
                post_needs_video_smm: true,
                post_needs_video_maker: true,
                post_needs_text: true,
                post_needs_photogallery: false,
                post_needs_cover_photo: false,
                post_needs_photo_cards: false,
                post_deadline: "22.02.2026",
                post_type: "SMM",
                post_status: "В работе"
            }
        ]

    })
}

async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Post" RESTART IDENTITY CASCADE`;
}

async function main() {
    try {
        await down();
        await up();
    } catch (e) {
        console.error(e);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });