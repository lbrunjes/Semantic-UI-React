import _ from 'lodash'

/**
 * Derives component info from the file layout of `src/`.
 *
 * Components live at `src/<type>s/<Parent>/<Name>.(js|tsx)`, where `<Name>` is either the parent itself
 * (i.e. "src/elements/Button/Button.js") or a subcomponent prefixed by its parent's name
 * (i.e. "src/elements/Button/ButtonGroup.js").
 */
// Only paths are needed, modules are not loaded
const componentPaths = Object.keys(
  import.meta.glob('/src/{addons,collections,elements,modules,views}/*/*.{js,tsx}'),
)

const getComponentInfo = (componentPath) => {
  const [, , typeDir, dirname, filename] = componentPath.split('/')
  const filenameWithoutExt = filename.replace(/\.(js|tsx)$/, '')

  if (!_.startsWith(filenameWithoutExt, dirname)) return null

  const displayName = filenameWithoutExt
  const isParent = filenameWithoutExt === dirname
  const isChild = !isParent
  const parentDisplayName = isParent ? null : dirname
  const subcomponentName = isParent ? null : displayName.replace(parentDisplayName, '')

  return {
    displayName,
    type: typeDir.replace(/s$/, ''),
    isParent,
    isChild,
    parentDisplayName,
    subcomponentName,
    apiPath: isChild ? `${parentDisplayName}.${subcomponentName}` : displayName,
    componentClassName: (isChild
      ? subcomponentName.replace(/Group$/, `${parentDisplayName}s`)
      : displayName
    ).toLowerCase(),
    repoPath: componentPath.replace(/^\//, ''),
    filename,
    filenameWithoutExt,
  }
}

const infoObjects = _.compact(componentPaths.map(getComponentInfo))

const componentInfoContext = {
  byDisplayName: _.keyBy(infoObjects, 'displayName'),
  parents: _.filter(infoObjects, 'isParent'),
}

export default componentInfoContext
