import { VisualizationController } from './visualization_controller'
import { createPage } from './page'

/**
 * Entry point for the standalone web version (not used in extension).
 */
const root = document.getElementById('root')
if (root) {
  createPage(root)

  let controller = new VisualizationController(null)
}
