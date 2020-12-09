import * as PIXI from 'pixi.js'
import {gameState} from '../index'

// sidebar height should equal board height
// sidebar x position should equal board width plus a few pixels
// sidebar should render: room code, current turn, points to win, player points, player points per turn
// sidebar needs access to gameState.currentTurn, gameState.pointsToWin, gameState.currentPlayers[playerName].playerName, gameState.currentPlayers[playerName].victoryPoints

export const SidebarContainer = new PIXI.Container()

export let sidebarDisplays = {}

export function renderSidebar(roomObj) {
  let roomCodeDisplay = new PIXI.Text(`Room Code: ${roomObj.name}`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'center'
  })
  sidebarDisplays.roomCodeDisplay = roomCodeDisplay
  SidebarContainer.addChild(roomCodeDisplay)

  let currentTurnDisplay = new PIXI.Text(`${gameState.currentTurn}'s Turn`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'center'
  })
  currentTurnDisplay.y = 50
  sidebarDisplays.currentTurnDisplay = currentTurnDisplay
  SidebarContainer.addChild(currentTurnDisplay)

  console.log('sidebar displays', sidebarDisplays)
}

export function updateCurrentTurnDisplay(currentTurnDisplay) {
  currentTurnDisplay.text = `${gameState.currentTurn}'s Turn`
}
