import { prisma } from "../src/lib/prisma";

async function up() {
    // 1. Создание пользователей с новой структурой ролей
    await prisma.user.createMany({
        data: [
            {
                user_login: "Artem69",
                user_password: '676767',
                admin_role: false,
                SMM_role: true,
                designer_role: false,
                videomaker_role: false,
                coordinator_role: false,
            },
            {
                user_login: "DimaDev",
                user_password: 'pussy69',
                admin_role: true,
                SMM_role: false,
                designer_role: false,
                videomaker_role: false,
                coordinator_role: false,
            },
            {
                user_login: "AnnaWeb",
                user_password: 'anna2026',
                admin_role: false,
                SMM_role: false,
                designer_role: false,
                videomaker_role: false,
                coordinator_role: true,
            },
            {
                user_login: "IvanSQL",
                user_password: 'sqlpro1',
                admin_role: false,
                SMM_role: false,
                designer_role: false,
                videomaker_role: true,
                coordinator_role: false,
            },
            {
                user_login: "MariaDesign",
                user_password: 'design88',
                admin_role: false,
                SMM_role: false,
                designer_role: true, 
                videomaker_role: false,
                coordinator_role: false,
            },
            {
                user_login: "AlexContent",
                user_password: 'content99',
                admin_role: false,
                SMM_role: true, 
                designer_role: false,
                videomaker_role: false,
                coordinator_role: false,
            },
            {
                user_login: "KateSupport",
                user_password: 'support24',
                admin_role: false,
                SMM_role: false,
                designer_role: false,
                videomaker_role: false,
                coordinator_role: true, 
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
                post_deadline: new Date("2026-02-16"), 
                post_date: new Date("2026-01-01"),
                post_type: "Видео",
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
                post_deadline: new Date("2026-02-20"),
                post_date: new Date("2026-01-02"),
                post_type: "Фото",
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
                post_deadline: new Date("2026-02-18"),
                post_date: new Date("2026-01-03"),
                post_type: "SMM",
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
                post_deadline: new Date("2026-02-25"),
                post_date: new Date("2026-01-04"),
                post_type: "Видео",
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
                post_deadline: new Date("2026-02-14"),
                post_date: new Date("2026-01-05"),
                post_type: "Фото",
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
                post_deadline: new Date("2026-02-13"),
                post_date: new Date("2026-01-06"),
                post_type: "Афиша",
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
                post_deadline: new Date("2026-02-17"),
                post_date: new Date("2026-01-07"),
                post_type: "Текст",
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
                post_deadline: new Date("2026-02-19"),
                post_date: new Date("2026-01-08"),
                post_type: "Дизайн",
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
                post_deadline: new Date("2026-02-15"),
                post_date: new Date("2026-01-09"),
                post_type: "Фото",
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
                post_deadline: new Date("2026-02-22"),
                post_date: new Date("2026-01-10"),
                post_type: "SMM",
            }
        ]
    });
}

async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Post" RESTART IDENTITY CASCADE`;
}

async function main() {
    try {
        await down();
        await up();
        console.log('Seeding completed successfully');
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