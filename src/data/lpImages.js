import landingHeroMain from "../assets/images/landing/hero/main.webp";
import landingHeroMain640 from "../assets/images/landing/hero/main-640.webp";
import landingHeroMain1024 from "../assets/images/landing/hero/main-1024.webp";
import landingHeroMain1600 from "../assets/images/landing/hero/main-1600.webp";
import landingHeroRight from "../assets/images/landing/hero/sub-right.webp";
import landingHeroRight640 from "../assets/images/landing/hero/sub-right-640.webp";
import landingHeroRight1024 from "../assets/images/landing/hero/sub-right-1024.webp";
import landingHeroRight1600 from "../assets/images/landing/hero/sub-right-1600.webp";
import landingHeroLeft from "../assets/images/landing/hero/sub-left.webp";
import landingHeroLeft640 from "../assets/images/landing/hero/sub-left-640.webp";
import landingHeroLeft1024 from "../assets/images/landing/hero/sub-left-1024.webp";
import landingHeroLeft1600 from "../assets/images/landing/hero/sub-left-1600.webp";

import landingGalleryColumn11 from "../assets/images/landing/gallery/column-1-1.webp";
import landingGalleryColumn12 from "../assets/images/landing/gallery/column-1-2.webp";
import landingGalleryColumn13 from "../assets/images/landing/gallery/column-1-3.webp";
import landingGalleryColumn21 from "../assets/images/landing/gallery/column-2-1.webp";
import landingGalleryColumn22 from "../assets/images/landing/gallery/column-2-2.webp";
import landingGalleryColumn23 from "../assets/images/landing/gallery/column-2-3.webp";
import landingGalleryColumn24 from "../assets/images/landing/gallery/column-2-4.webp";
import landingGalleryColumn25 from "../assets/images/landing/gallery/column-2-5.webp";
import landingGalleryColumn31 from "../assets/images/landing/gallery/column-3-1.webp";
import landingGalleryColumn32 from "../assets/images/landing/gallery/column-3-2.webp";
import landingGalleryColumn33 from "../assets/images/landing/gallery/column-3-3.webp";

import landingCtaRight from "../assets/images/landing/bottom_cta/right.webp";
import landingCtaLeft from "../assets/images/landing/bottom_cta/left.webp";
import landingCtaOverlay from "../assets/images/landing/bottom_cta/overlay.webp";

import membershipHero1 from "../assets/images/membership/hero-1.webp";
import membershipHero1_640 from "../assets/images/membership/hero-1-640.webp";
import membershipHero1_1024 from "../assets/images/membership/hero-1-1024.webp";
import membershipHero1_1600 from "../assets/images/membership/hero-1-1600.webp";
import membershipHero2 from "../assets/images/membership/hero-2.webp";
import membershipHero2_640 from "../assets/images/membership/hero-2-640.webp";
import membershipHero2_1024 from "../assets/images/membership/hero-2-1024.webp";
import membershipHero2_1600 from "../assets/images/membership/hero-2-1600.webp";
import membershipHero3 from "../assets/images/membership/hero-3.webp";
import membershipHero3_640 from "../assets/images/membership/hero-3-640.webp";
import membershipHero3_1024 from "../assets/images/membership/hero-3-1024.webp";
import membershipHero3_1600 from "../assets/images/membership/hero-3-1600.webp";
import membershipHero4 from "../assets/images/membership/hero-4.webp";
import membershipHero4_640 from "../assets/images/membership/hero-4-640.webp";
import membershipHero4_1024 from "../assets/images/membership/hero-4-1024.webp";
import membershipHero4_1600 from "../assets/images/membership/hero-4-1600.webp";

const withImage = (src, width, height, srcSetOverride) => ({
	src,
	srcSet: srcSetOverride || `${src} ${width}w`,
	width,
	height,
});

const buildSrcSet = (entries) =>
	entries.map(({ src, width }) => `${src} ${width}w`).join(", ");

export const joinImages = {
	heroMain: withImage(
		landingHeroMain,
		1792,
		828,
		buildSrcSet([
			{ src: landingHeroMain640, width: 640 },
			{ src: landingHeroMain1024, width: 1024 },
			{ src: landingHeroMain1600, width: 1600 },
			{ src: landingHeroMain, width: 1792 },
		])
	),
	heroRight: withImage(
		landingHeroRight,
		1920,
		1080,
		buildSrcSet([
			{ src: landingHeroRight640, width: 640 },
			{ src: landingHeroRight1024, width: 1024 },
			{ src: landingHeroRight1600, width: 1600 },
			{ src: landingHeroRight, width: 1920 },
		])
	),
	heroLeft: withImage(
		landingHeroLeft,
		2436,
		1125,
		buildSrcSet([
			{ src: landingHeroLeft640, width: 640 },
			{ src: landingHeroLeft1024, width: 1024 },
			{ src: landingHeroLeft1600, width: 1600 },
			{ src: landingHeroLeft, width: 2436 },
		])
	),
	memoryWide: withImage(landingGalleryColumn21, 1627, 752),
	memoryTall: withImage(landingGalleryColumn11, 2048, 1536),
	memoryStd1: withImage(landingGalleryColumn22, 2048, 1536),
	memoryStd2: withImage(landingGalleryColumn25, 2048, 1536),
	ctaRight: withImage(landingCtaRight, 2048, 1536),
	ctaLeft: withImage(landingCtaLeft, 2160, 1620),
	ctaOverlay: withImage(landingCtaOverlay, 2816, 1536),
};

export const galleryImages = {
	column1: [
		withImage(landingGalleryColumn11, 2048, 1536),
		withImage(landingGalleryColumn12, 2160, 1620),
		withImage(landingGalleryColumn13, 1920, 1080),
	],
	column2: [
		withImage(landingGalleryColumn21, 1627, 752),
		withImage(landingGalleryColumn22, 2048, 1536),
		withImage(landingGalleryColumn23, 1792, 828),
		withImage(landingGalleryColumn24, 2160, 1620),
		withImage(landingGalleryColumn25, 2048, 1536),
	],
	column3: [
		withImage(landingGalleryColumn31, 1920, 1080),
		withImage(landingGalleryColumn32, 2160, 1620),
		withImage(landingGalleryColumn33, 2048, 1536),
	],
};

export const homeHeroImages = [
	withImage(
		membershipHero1,
		1792,
		828,
		buildSrcSet([
			{ src: membershipHero1_640, width: 640 },
			{ src: membershipHero1_1024, width: 1024 },
			{ src: membershipHero1_1600, width: 1600 },
			{ src: membershipHero1, width: 1792 },
		])
	),
	withImage(
		membershipHero2,
		1792,
		828,
		buildSrcSet([
			{ src: membershipHero2_640, width: 640 },
			{ src: membershipHero2_1024, width: 1024 },
			{ src: membershipHero2_1600, width: 1600 },
			{ src: membershipHero2, width: 1792 },
		])
	),
	withImage(
		membershipHero3,
		1627,
		752,
		buildSrcSet([
			{ src: membershipHero3_640, width: 640 },
			{ src: membershipHero3_1024, width: 1024 },
			{ src: membershipHero3_1600, width: 1600 },
			{ src: membershipHero3, width: 1627 },
		])
	),
	withImage(
		membershipHero4,
		1920,
		1080,
		buildSrcSet([
			{ src: membershipHero4_640, width: 640 },
			{ src: membershipHero4_1024, width: 1024 },
			{ src: membershipHero4_1600, width: 1600 },
			{ src: membershipHero4, width: 1920 },
		])
	),
];
