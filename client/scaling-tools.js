const canvas = document.getElementById('mycanvas')

const RATIO = [4, 3] //4:3
// const resolution

function scaleContainerSize(container) {
  //find distace from container width/height to window width/height
  let heightDelta = canvas.height - container.height
  let widthDelta = canvas.width - container.width

  let diff = heightDelta < widthDelta ? heightDelta : widthDelta

  container.width = container.height += diff //<-- in the beginning this isn't scaling the contianer properly
}

export function scaleContainerPosition(container) {
  container.x = canvas.width / 2
  container.y = canvas.height / 2
}

//Notes: seems like containers gain width and hieght with Sprite additions.
// maybe there might be a way to presize containers? or perhaps resize regardless of width/height??
// The main problem is certainly this: the container size is determined by the sprites passed it, making it somewhat unpredictable.
export function scaleContainer(container) {
  scaleContainerSize(container)
  scaleContainerPosition(container)
}
