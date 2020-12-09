import * as PIXI from 'pixi.js'
import {gameState} from '../index'

// sidebar height should equal board height
// sidebar x position should equal board width plus a few pixels
// sidebar should render: room code, current turn, points to win, player points, player points per turn
// sidebar needs access to gameState.currentTurn, gameState.pointsToWin, gameState.currentPlayers[playerName].playerName, gameState.currentPlayers[playerName].victoryPoints

export const SidebarContainer = new PIXI.Container()

export function renderSidebar(roomObj) {
  let roomCodeDisplay = new PIXI.Text(`Room Code: ${roomObj.name}`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'center'
  })
  SidebarContainer.addChild(roomCodeDisplay)

  let currentTurnDisplay = new PIXI.Text(`${gameState.currentTurn}'s Turn`, {
    fontFamily: 'Arial',
    fontSize: 48,
    fill: 0xffffff,
    align: 'center'
  })
  currentTurnDisplay.y = 50
  SidebarContainer.addChild(currentTurnDisplay)
}
