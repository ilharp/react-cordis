import type { Notifier } from '@koishijs/plugin-notifier'
import h from '@satorijs/element'
import type { Context } from 'koishi'
import cloneDeepWith from 'lodash.clonedeepwith'
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
  object,
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
    return h(type, {
      ...props,
      children: undefined,
    })
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
    instance,
    _updatePayload,
    _type,
    _prevProps,
    nextProps,
    _internalHandle,
  ) {
    instance.attrs = {
      ...nextProps,
      children: undefined,
    }
  },

  commitTextUpdate(textInstance, _oldText, newText) {
    textInstance.attrs['content'] = newText
  },

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
  warnsIfNotActing: false,
})

export const buildReactCordisNotifier = (update: () => void) =>
  Reconciler(buildHostConfig(update))

export const render = (
  ctx: Context,
  element: ReactNode,
  type?: Notifier.Type,
) => {
  const notifier = ctx.notifier.create({
    type: type || 'primary',
    content: '',
  })
  const rootContainer = h('p')

  const update = () =>
    notifier.update({
      type: type || 'primary',
      content: cloneDeepWith(rootContainer, (x) =>
        typeof x === 'function' ? x : undefined,
      ),
    })

  const reactCordisNotifier = buildReactCordisNotifier(update)

  reactCordisNotifier.updateContainer(
    element,
    // @ts-expect-error
    reactCordisNotifier.createContainer(rootContainer),
    null,
  )

  return () => notifier.dispose()
}
