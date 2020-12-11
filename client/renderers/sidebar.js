import * as PIXI from 'pixi.js'
import {GameContainer, gameState} from '../index'

// sidebar height should equal board height
// sidebar x position should equal board width plus a few pixels
// sidebar should render: room code, current turn, points to win, player points, player points per turn
// sidebar needs access to gameState.currentTurn, gameState.pointsToWin, gameState.currentPlayers[playerName].playerName, gameState.currentPlayers[playerName].victoryPoints

// sidebarContainer structure
// sidebarContainer
// - gameInfoContainer
//   - CurrentTurnContainer
//     - currentTurnPlayerDisplay
//     - currentTurnDisplay
//     - pointsToWinDisplay
// - Player1InfoContainer
//   - Player1NameContainer
//     - player1IconSprite
//     - player1NameDisplay
//     - player1Indicator
//   - player1PointsDisplay
//   - player1PerTurnDisplay
// - Player2InfoContainer
//   - Player2NameContainer
//     - player2IconSprite
//     - player2NameDisplay
//     - player2Indicator
//   - player2PointsDisplay
//   - player2PerTurnDisplay
// - logoSprite

export const SidebarContainer = new PIXI.Container()

export const sidebarDisplays = {}

export function renderSidebar(roomObj) {
  let roomCodeDisplay = new PIXI.Text(`Room Code: ${roomObj.name}`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'left'
  })
  sidebarDisplays.roomCodeDisplay = roomCodeDisplay
  SidebarContainer.addChild(roomCodeDisplay)

  renderGameInfo()

  const Player1InfoContainer = renderPlayer1Info()
  renderPlayer1Name(Player1InfoContainer)

  const Player2InfoContainer = renderPlayer2Info()
  renderPlayer2Name(Player2InfoContainer)

  renderLogo()

  SidebarContainer.x = GameContainer.width + 30

  console.log('roomObj in renderSidebar', roomObj)
  console.log('gameState in renderSidebar', gameState)
  console.log('sidebar displays', sidebarDisplays)
}

export function renderGameInfo() {
  // render game state info
  const GameInfoContainer = new PIXI.Container()

  const CurrentTurnContainer = new PIXI.Container()

  const currentTurnPlayerDisplay = new PIXI.Text(
    `${gameState.currentPlayers[gameState.currentTurn].faction}`,
    {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0xffffff,
      align: 'left'
    }
  )
  currentTurnPlayerDisplay.y = 50
  sidebarDisplays.currentTurnPlayerDisplay = currentTurnPlayerDisplay
  CurrentTurnContainer.addChild(currentTurnPlayerDisplay)

  const currentTurnDisplay = new PIXI.Text(`'s Turn`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'left'
  })
  sidebarDisplays.currentTurnDisplay = currentTurnDisplay
  currentTurnDisplay.x = currentTurnPlayerDisplay.width
  currentTurnDisplay.y = 50
  CurrentTurnContainer.addChild(currentTurnDisplay)

  GameInfoContainer.addChild(CurrentTurnContainer)

  const pointsToWinDisplay = new PIXI.Text(
    `VP Threshold: ${gameState.pointsToWin}`,
    {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0xffffff,
      align: 'left'
    }
  )
  pointsToWinDisplay.y = 100
  sidebarDisplays.pointsToWinDisplay = pointsToWinDisplay
  GameInfoContainer.addChild(pointsToWinDisplay)

  SidebarContainer.addChild(GameInfoContainer)
}

export function renderPlayer1Info() {
  // render player1 info
  const Player1InfoContainer = new PIXI.Container()

  const player1PointsDisplay = new PIXI.Text(
    `Victory Points: ${gameState.currentPlayers.player1.victoryPoints} / ${
      gameState.pointsToWin
    }`,
    {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0xffffff,
      align: 'left'
    }
  )
  player1PointsDisplay.x = 50
  player1PointsDisplay.y = 200
  sidebarDisplays.player1PointsDisplay = player1PointsDisplay
  Player1InfoContainer.addChild(player1PointsDisplay)

  const player1PerTurnDisplay = new PIXI.Text(`VP / Turn: 0`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'left'
  })
  player1PerTurnDisplay.x = 50
  player1PerTurnDisplay.y = 250
  sidebarDisplays.player1PerTurnDisplay = player1PerTurnDisplay
  Player1InfoContainer.addChild(player1PerTurnDisplay)

  SidebarContainer.addChild(Player1InfoContainer)

  return Player1InfoContainer
}

export function renderPlayer1Name(Player1InfoContainer) {
  // render player1's name and attach to player1's container
  const Player1NameContainer = new PIXI.Container()

  const player1IconTexture = PIXI.Texture.from('/images/faction_usa.png')
  const player1IconSprite = new PIXI.Sprite(player1IconTexture)
  player1IconSprite.width = 50
  player1IconSprite.height = 50
  player1IconSprite.y = 150
  Player1NameContainer.addChild(player1IconSprite)

  const player1NameDisplay = new PIXI.Text('Federation', {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0x0f7001,
    align: 'left'
  })
  player1NameDisplay.x = player1IconSprite.width
  player1NameDisplay.y = 150
  sidebarDisplays.player1NameDisplay = player1NameDisplay
  Player1NameContainer.addChild(player1NameDisplay)

  if (gameState.me === 'player1') {
    const player1Indicator = new PIXI.Text(' (You)', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0xffffff,
      align: 'left'
    })
    player1Indicator.x = player1IconSprite.width + player1NameDisplay.width
    player1Indicator.y = 150
    sidebarDisplays.player1Indicator = player1Indicator
    Player1NameContainer.addChild(player1Indicator)
  }

  Player1InfoContainer.addChild(Player1NameContainer)
}

export function renderPlayer2Info() {
  // render player2 info
  const Player2InfoContainer = new PIXI.Container()

  const Player2PointsDisplay = new PIXI.Text(
    `Victory Points: ${gameState.currentPlayers.player2.victoryPoints} / ${
      gameState.pointsToWin
    }`,
    {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0xffffff,
      align: 'left'
    }
  )
  Player2PointsDisplay.x = 50
  Player2PointsDisplay.y = 350
  sidebarDisplays.player2PointsDisplay = Player2PointsDisplay
  Player2InfoContainer.addChild(Player2PointsDisplay)

  const player2PerTurnDisplay = new PIXI.Text(`VP / Turn: 0`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'left'
  })
  player2PerTurnDisplay.x = 50
  player2PerTurnDisplay.y = 400
  sidebarDisplays.player2PerTurnDisplay = player2PerTurnDisplay
  Player2InfoContainer.addChild(player2PerTurnDisplay)

  SidebarContainer.addChild(Player2InfoContainer)

  return Player2InfoContainer
}

export function renderPlayer2Name(Player2InfoContainer) {
  // render player2's name and attach to player2's container
  const Player2NameContainer = new PIXI.Container()

  const player2IconTexture = PIXI.Texture.from('/images/faction_ger.png')
  const player2IconSprite = new PIXI.Sprite(player2IconTexture)
  player2IconSprite.width = 50
  player2IconSprite.height = 50
  player2IconSprite.y = 300
  Player2NameContainer.addChild(player2IconSprite)

  const player2NameDisplay = new PIXI.Text('Empire', {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0x0000fe,
    align: 'left'
  })
  player2NameDisplay.x = player2IconSprite.width
  player2NameDisplay.y = 300
  sidebarDisplays.player2NameDisplay = player2NameDisplay
  Player2NameContainer.addChild(player2NameDisplay)

  if (gameState.me === 'player2') {
    const player2Indicator = new PIXI.Text(' (You)', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0xffffff,
      align: 'left'
    })
    player2Indicator.x = player2IconSprite.width + player2NameDisplay.width
    player2Indicator.y = 300
    sidebarDisplays.player2Indicator = player2Indicator
    Player2NameContainer.addChild(player2Indicator)
  }

  Player2InfoContainer.addChild(Player2NameContainer)
}

export function renderLogo() {
  const logoTexture = PIXI.Texture.from('/images/logo.png')
  const logoSprite = new PIXI.Sprite(logoTexture)
  logoSprite.y = GameContainer.height - 115
  SidebarContainer.addChild(logoSprite)
  console.log('sidebar logoSprite', logoSprite)
}

// called in takeTurn in index.js
export function updateCurrentTurnDisplay(
  currentTurnPlayerDisplay,
  currentTurnDisplay
) {
  const currentTurn = gameState.currentTurn
  currentTurnPlayerDisplay.text = `${
    gameState.currentPlayers[currentTurn].faction
  }`
  currentTurnDisplay.x = currentTurnPlayerDisplay.width
  switch (currentTurn) {
    case 'player1':
      sidebarDisplays.currentTurnPlayerDisplay.tint = 0x0f7001
      break
    case 'player2':
      sidebarDisplays.currentTurnPlayerDisplay.tint = 0x0000fe
      break
    default:
      sidebarDisplays.currentTurnPlayerDisplay.tint = 0xffffff
  }
}

// called in takeTurn in index.js
export function updatePointsDisplays() {
  sidebarDisplays.player1PointsDisplay.text = `Victory Points: ${
    gameState.currentPlayers.player1.victoryPoints
  } / ${gameState.pointsToWin}`
  sidebarDisplays.player2PointsDisplay.text = `Victory Points: ${
    gameState.currentPlayers.player2.victoryPoints
  } / ${gameState.pointsToWin}`
}

// called in removeOwnedTile & addOwnedTile on Player class prototype
export function updatePerTurnDisplay(playerName, ownedTiles) {
  console.log(`${playerName}'s tiles`, ownedTiles)
  const vpPerTurn = ownedTiles.reduce((total, tile) => {
    return total + tile.points
  }, 0)

  switch (playerName) {
    case 'player1':
      sidebarDisplays.player1PerTurnDisplay.text = `VP / Turn: ${vpPerTurn}`
      break
    case 'player2':
      sidebarDisplays.player2PerTurnDisplay.text = `VP / Turn: ${vpPerTurn}`
      break
    default:
      console.log('did not update perTurnDisplay')
  }
}
