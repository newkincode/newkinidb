import discord
import json
import asyncio

intents = discord.Intents.default()
intents.message_content = True

bot = discord.Bot(intents=intents)

def check(m):
    if m.reference is not None:
         return True
    return False


@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')

@bot.event
async def on_message(message: discord.Message):
    print(check(message))
    if message.author == bot.user:
        return
    elif check(message):
        msg = await message.channel.fetch_message(message.reference.message_id)
        if msg.author == bot.user:
            embaad = msg.embeds[0]
            emde = embaad.description
            emde+=f"\n└{message.author.mention}: {message.content}"
            embaad.description = emde
            await msg.edit(embed=embaad)
            await message.delete()
    else:
        if check(message) == False:
            if message.attachments == []:
                embad = discord.Embed(color=discord.Colour.blue(), description=message.content)
            elif message.attachments != []:
                embad = discord.Embed(color=discord.Colour.blue(), description=message.content, image=message.attachments[0].url)
            embad.set_author(name=message.author,icon_url=message.author.avatar)
            await message.channel.send(embed=embad)
            await message.delete()
    
bot.run("MTI3MTc5Mzk5NzUzNDIwMzk1NA.GNz9IL.SWLvyYLKK3ofVewoYLzBtRNx2iWgeffE8CG3gE")
