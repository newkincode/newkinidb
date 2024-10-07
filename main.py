import discord
import json

intents = discord.Intents.default()
intents.message_content = True

with open("./db.json", "r", encoding='UTF8') as file:
    textmap = json.loads(file.read())

class Learn(discord.ui.Modal):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

        self.add_item(discord.ui.InputText(label="말"))
        self.add_item(discord.ui.InputText(label="대답", style=discord.InputTextStyle.long))

    async def callback(self, interaction: discord.Interaction):
        embed = discord.Embed(title="등록됨!")
        embed.add_field(name="말", value=self.children[0].value)
        embed.add_field(name="대답", value=self.children[1].value)
        await interaction.response.send_message(embeds=[embed])
        textmap[self.children[0].value] = self.children[1].value

bot = discord.Bot(intents=intents)

@bot.event
async def on_ready():
    print(f"We have logged in as {bot.user}")

@bot.slash_command(name="뉴키니야", guild_ids=[1243922664532213840])
async def hello(ctx: discord.Interaction, text:str):
    try:
        await ctx.respond(textmap[text])
    except:
        await ctx.respond("네..?")

@bot.slash_command(name="가르치기", guild_ids=[1243922664532213840])
async def hello(ctx: discord.Interaction):
    modal = Learn(title="가르치기")
    await ctx.send_modal(modal)

bot.run("MTI3MTc5Mzk5NzUzNDIwMzk1NA.GuqiYD.rNk3HO8t1aofzeOf-N6DW6u_9dglrxFbjsIpR0")

with open("./db.json", "w") as file:
    file.write(json.dumps(textmap))