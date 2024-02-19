const mineflayer = require('mineflayer')
// Goals to achieve
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock

// bot instance
const bot = mineflayer.createBot({
    host: 'localhost',
    port: 40947,
    username: 'pathfinder_Bot'
})

bot.loadPlugin(pathfinder)

function followPlayer() {
    const playerCI = bot.players['TheDudeFromCI']

    if (!playerCI || !playerCI.entity) {
        bot.chat("I can't see CI!")
        return
    }

    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.scafoldingBlocks = []

    bot.pathfinder.setMovements(movements)

    const goal = new GoalFollow(playerCI.entity, 1)
    bot.pathfinder.setGoal(goal, true)
}

function locateEmeraldBlock () {
    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    movements.scafoldingBlocks = []
    bot.pathfinder.setMovements(movements)

    const emeraldBlock = bot.findBlock({
        matching: mcData.blocksByName.emerald_block.id,
        maxDistance: 32
    })

    if (!emeraldBlock) {
        bot.chat("I can't see any emerald blocks!")
        return
    }

    const x = emeraldBlock.position.x
    const y = emeraldBlock.position.y + 1
    const z = emeraldBlock.position.z
    const goal = new GoalBlock(x, y, z)
    bot.pathfinder.setGoal(goal)
}

bot.once('spawn', locateEmeraldBlock)
