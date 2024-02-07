import type { Notifier } from '@koishijs/plugin-notifier'
import h from '@satorijs/element'
import type { Context } from 'koishi'
import type { ReactNode } from 'react'
import type { HostConfig } from 'react-reconciler'
import Reconciler from 'react-reconciler'
import { DefaultEventPriority } from 'react-reconciler/constants'

const shallowEqual = <T extends string | number | symbol>(
  x: Record<T, unknown>,
  y: Record<T, unknown>,
) =>
  Object.keys(x).length === Object.keys(y).length &&
  Object.keys(x).every(
    (key) => y.hasOwnProperty(key) && x[key as T] === y[key as T],
  )

const buildHostConfig = (
  update: () => void,
): HostConfig<
  never,
  never,
  h,
  h,
  h,
  never,
  never,
  h,
  null,
  true,
  never,
  number,
  number
> => ({
  supportsMutation: true,
  supportsPersistence: false,

  createInstance(type, props, _rootContainer, _hostContext, _internalHandle) {
    return h(type, props)
  },

  createTextInstance(text, _rootContainer, _hostContext, _internalHandle) {
    return h.text(text)
  },

  shouldSetTextContent(_type, _props) {
    return false
  },

  appendInitialChild(parentInstance, child) {
    parentInstance.children.push(child)
  },

  appendChild(parentInstance, child) {
    parentInstance.children.push(child)
  },

  insertBefore(parentInstance, child, beforeChild) {
    parentInstance.children.splice(
      parentInstance.children.findIndex((x) => x === beforeChild),
      0,
      child,
    )
  },

  removeChild(parentInstance, child) {
    parentInstance.children.splice(parentInstance.children.indexOf(child), 1)
  },

  appendChildToContainer(container, child) {
    container.children.push(child)
  },

  insertInContainerBefore(container, child, beforeChild) {
    container.children.splice(
      container.children.findIndex((x) => x === beforeChild),
      0,
      child,
    )
  },

  removeChildFromContainer(container, child) {
    container.children.splice(container.children.indexOf(child), 1)
  },

  resetTextContent(instance) {
    instance.attrs['content'] = ''
  },

  hideInstance(_instance) {
    throw new Error('Not Implemented')
  },

  hideTextInstance(_textInstance) {
    throw new Error('Not Implemented')
  },

  unhideInstance(_instance, _props) {
    throw new Error('Not Implemented')
  },

  unhideTextInstance(_textInstance, _text) {
    throw new Error('Not Implemented')
  },

  clearContainer(container) {
    container.children.length = 0
  },

  prepareUpdate(
    _instance,
    _type,
    oldProps,
    newProps,
    _rootContainer,
    _hostContext,
  ) {
    if (!shallowEqual(newProps, oldProps)) {
      return true
    }
    return null
  },

  commitUpdate(
    _instance,
    _updatePayload,
    _type,
    _prevProps,
    _nextProps,
    _internalHandle,
  ) {},

  commitTextUpdate(_textInstance, _oldText, _newText) {},

  finalizeInitialChildren(
    _instance,
    _type,
    _props,
    _rootContainer,
    _hostContext,
  ) {
    return false
  },

  commitMount(_instance, _type, _props, _internalInstanceHandle) {},

  getRootHostContext(_rootContainer) {
    return null
  },

  getChildHostContext(parentHostContext, _type, _rootContainer) {
    return parentHostContext
  },

  getPublicInstance(instance) {
    return instance
  },

  prepareForCommit(_containerInfo) {
    return null
  },

  resetAfterCommit(_containerInfo) {
    update()
  },

  preparePortalMount(_containerInfo) {},

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: 0,

  supportsMicrotasks: true,
  scheduleMicrotask: queueMicrotask,

  getCurrentEventPriority() {
    return DefaultEventPriority
  },

  isPrimaryRenderer: true,
  getInstanceFromNode(_node) {
    throw new Error('Not Implemented')
  },
  beforeActiveInstanceBlur() {
    throw new Error('Not Implemented')
  },
  afterActiveInstanceBlur() {
    throw new Error('Not Implemented')
  },
  prepareScopeUpdate(_scopeInstance) {
    throw new Error('Not Implemented')
  },
  getInstanceFromScope(_scopeInstance) {
    throw new Error('Not Implemented')
  },
  detachDeletedInstance(_node) {
    throw new Error('Not Implemented')
  },
  supportsHydration: false,
})

export const buildReactCordisNotifier = (update: () => void) =>
  Reconciler(buildHostConfig(update))

export const render = (
  ctx: Context,
  type: Notifier.Type,
  element: ReactNode,
) => {
  const notifier = ctx.notifier.create({
    type,
    content: '',
  })
  const rootContainer = h('message')

  const update = () =>
    notifier.update({
      type,
      content: rootContainer,
    })

  const reactCordisNotifier = buildReactCordisNotifier(update)

  // @ts-expect-error
  reactCordisNotifier.createContainer(rootContainer)

  reactCordisNotifier.updateContainer(element, rootContainer, null)

  return () => notifier.dispose()
}
