import discord
import json

intents = discord.Intents.default()
intents.message_content = True

bot = discord.Bot(intents=intents)

@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')

@bot.event
async def on_message(message: discord.Message):
    if message.author == bot.user:
        return
    else:
        embad = discord.Embed(color=discord.Colour.blue(), description=message.content, image=message)
        embad.set_author(name=message.author,icon_url=message.author.avatar)
        await message.channel.send(embed=embad)
        await message.delete()


bot.run("MTI3MTc5Mzk5NzUzNDIwMzk1NA.G5-eeg.ZiFtSVkwEM1ohhiFwnuUCpsJFpVPUEXv5r75Tc")
