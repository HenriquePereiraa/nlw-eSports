import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { convertHoursStringToMInutos } from "./utils/convert-hour-string-to-minutos";
import { convertMinutosToHourString } from "./utils/convert-minutos-to-hour-string";

const app = express();

app.use(express.json());

app.use(cors())

const prisma = new PrismaClient({
  log: ["query"],
});


app.get("/games", async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });

  return response.json(games);
});

app.get("/games/:id/ads", async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hoursStart: true,
      hoursEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return response.json(
    ads.map((ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(","),
        hoursStart: convertMinutosToHourString(ad.hoursStart),
        hoursEnd: convertMinutosToHourString(ad.hoursEnd),
      };
    })
  );
});

app.get("/ads/:id/discord", async (request, response) => {
  const adId = request.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });

  return response.json({
    discord: ad.discord,
  });
});

app.post("/games/:id/ads", async (request, response) => {
  const gameId = request.params.id;
  const body = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(","),
      hoursStart: convertHoursStringToMInutos(body.hoursStart),
      hoursEnd: convertHoursStringToMInutos(body.hoursEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  });

  return response.json(ad);
});

app.listen(3333);
