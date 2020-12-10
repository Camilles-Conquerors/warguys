import * as PIXI from 'pixi.js'
import {gameState, renderGame} from '../index'

// sidebar height should equal board height
// sidebar x position should equal board width plus a few pixels
// sidebar should render: room code, current turn, points to win, player points, player points per turn
// sidebar needs access to gameState.currentTurn, gameState.pointsToWin, gameState.currentPlayers[playerName].playerName, gameState.currentPlayers[playerName].victoryPoints

// sidebarContainer structure
// sidebarContainer
// - gameInfoContainer
//   - currentTurnDisplay
//   - pointsToWinDisplay
// - Player1InfoContainer
//   - player1NameDisplay
//   - player1PointsDisplay
//   - player1PerTurnDisplay
// - Player2InfoContainer
//   - player2NameDisplay
//   - player2PointsDisplay
//   - player2PerTurnDisplay

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

  renderPlayer1Info()

  renderPlayer2Info()

  console.log('roomObj in renderSidebar', roomObj)
  console.log('gameState in renderSidebar', gameState)
  console.log('sidebar displays', sidebarDisplays)
}

export function renderGameInfo() {
  // render game state info
  const GameInfoContainer = new PIXI.Container()
  const currentTurnDisplay = new PIXI.Text(`${gameState.currentTurn}'s Turn`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'left'
  })
  currentTurnDisplay.y = 50
  sidebarDisplays.currentTurnDisplay = currentTurnDisplay
  GameInfoContainer.addChild(currentTurnDisplay)

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

  const player1NameDisplay = new PIXI.Text(`Player 1`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xff0000,
    align: 'left'
  })
  player1NameDisplay.y = 150
  sidebarDisplays.player1NameDisplay = player1NameDisplay
  Player1InfoContainer.addChild(player1NameDisplay)

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
}

export function renderPlayer2Info() {
  // render player2 info
  const Player2InfoContainer = new PIXI.Container()

  const Player2NameDisplay = new PIXI.Text(`Player 2`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0x0000ff,
    align: 'left'
  })
  Player2NameDisplay.y = 300
  sidebarDisplays.player2NameDisplay = Player2NameDisplay
  Player2InfoContainer.addChild(Player2NameDisplay)

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
}

export function updateCurrentTurnDisplay(currentTurnDisplay) {
  currentTurnDisplay.text = `${gameState.currentTurn}'s Turn`
}

export function updatePointsDisplays() {
  sidebarDisplays.player1PointsDisplay.text = `Victory Points: ${
    gameState.currentPlayers.player1.victoryPoints
  } / ${gameState.pointsToWin}`
  sidebarDisplays.player2PointsDisplay.text = `Victory Points: ${
    gameState.currentPlayers.player2.victoryPoints
  } / ${gameState.pointsToWin}`
}

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
