// 以setState为例分析react-hook源码知识
// 这里useState其实是dispatcher对象里面的一个方法
export function useState < S > (initialState: (() => S) | S) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
// 继续跟踪dispatcher即resolveDispatcher()的返回值
function resolveDispatcher() {
  //主要还是使用的ReactCurrentDispatcher这个对象的值
  const dispatcher = ReactCurrentDispatcher.current;
  //...
  return dispatcher;
}

// 继续跟中ReactCurrentDispatcher
const ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  // 追寻到其实最初使用的还是react自身提供的Dispatcher,最终指向的还是新版协调器中的FiberHooks
  // import type {Dispatcher} from 'react-reconciler/src/ReactFiberHooks';
  current: (null: null | Dispatcher),
};

// 继续跟进Dispatcher  path: 'react-reconciler/src/ReactFiberHooks'
// 进入Dispatcher 发现Dispatcher的生命里面一大堆相关的hook,全部都在这里定义好了，找到useState的声明
export type Dispatcher = {
  readContext<T>(
    context: ReactContext<T>,
    observedBits: void | number | boolean,
  ): T,
  // useState定义的格式，一个进入的泛型S是函数或者一个值，同时返回一个S以及动作用于更新S
  useState<S>(initialState: (() => S) | S): [S, Dispatch<BasicStateAction<S>>],
  useReducer<S, I, A>(
    reducer: (S, A) => S,
    initialArg: I,
    init?: (I) => S,
  ): [S, Dispatch<A>],
  useContext<T>(
    context: ReactContext<T>,
    observedBits: void | number | boolean,
  ): T,
  useRef<T>(initialValue: T): {current: T},
  useEffect(
    create: () => (() => void) | void,
    deps: Array<mixed> | void | null,
  ): void,
  useLayoutEffect(
    create: () => (() => void) | void,
    deps: Array<mixed> | void | null,
  ): void,
  useCallback<T>(callback: T, deps: Array<mixed> | void | null): T,
  useMemo<T>(nextCreate: () => T, deps: Array<mixed> | void | null): T,
  useImperativeHandle<T>(
    ref: {current: T | null} | ((inst: T | null) => mixed) | null | void,
    create: () => T,
    deps: Array<mixed> | void | null,
  ): void,
  useDebugValue<T>(value: T, formatterFn: ?(value: T) => mixed): void,
};

// 跟进Dispatcher真正的逻辑实体,发现有各种各样的实体使用到了Dispatcher的定义在此选择hook挂载以及hook更新的状态实体去分析
//Hooks 挂载在组件时的情形, 全都是mount状态
const HooksDispatcherOnMount: Dispatcher = {
  readContext,

  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  //useState在mount状态的时候对应的mountState进行跟踪
  useState: mountState,
  useDebugValue: mountDebugValue,
};

// mountState 相关的代码
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  // 定义一个hook的东西，这个hook不知道是个什么东西，好像是从workInProgress这个Fiber树里面拿出来的东西
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    // 惰性初始化初始状态
    initialState = initialState();
  }
  // 当前hook记住的状态momoizedState = initialState即初始化state的值
  hook.memoizedState = hook.baseState = initialState;
  // 定义一个hook的队列
  const queue = (hook.queue = {
    last: null, // 不明白是什么东西
    dispatch: null, // 这个感觉有点像状态管理的动作触发器
    lastRenderedReducer: basicStateReducer, //不知道什么东西，根据命名，可以认为是上一次渲染的renducer
    lastRenderedState: (initialState: any), // 这个应该是上一次渲染的state啦
  });
  const dispatch: Dispatch<
    BasicStateAction<S>,
  > = (queue.dispatch = (dispatchAction.bind(
    null,
    // Flow doesn't know this is non-null, but we do.
    ((currentlyRenderingFiber: any): Fiber),
    queue,
  ): any)); // 这里hook.queue.dispatch其实就是react里面内置的一个dispatchAction的函数，具体里面估计是干嘛的不太清楚，稍候分析
  return [hook.memoizedState, dispatch];
}

/**
 * 这里分析以上的mountState分几步进行
 * 1、mountWorkInProgressHook这个函数里面返回的是什么东西？里面有什么东西？为什么命名为hook?
 * 2、dispatchAction函数
 * 3、此步可不用这么详细进行分析，basicStateReducer是什么，它有什么用，怎么用，以及currentlyRenderingFiber是个什么东西
 */

 // 1、mountWorkInProgressHook是个什么东西
 function mountWorkInProgressHook(): Hook {
  // 其实就是返回一个hook，就是一个简单的对象
  const hook: Hook = {
    memoizedState: null,

    baseState: null,
    queue: null,
    baseUpdate: null,

    next: null,
  };
  // 这里其实就是构建一个类似链表的东西？
  // HookA -> HookB -> HookC -> HookD ?
  // 感觉就是这个东西了最后把当前链表节点返回
  if (workInProgressHook === null) {
    // This is the first hook in the list
    // 这个firstWorkInprogressHook似乎是全局变量
    firstWorkInProgressHook = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}

// 2、明白了hook是个什么东西，现在第二步，dispatcherAction是个什么东西?
// 这个东西比较难啃看起来就挺复杂的，但是现在咱们先不去动它，因为咱们只是进行的一个挂载动作，没有任何动作行为，无法触发该函数执行
function dispatchAction<S, A>(
  fiber: Fiber, // currentlyRenderingFiber
  queue: UpdateQueue<S, A>, // mount阶段queue {last: null, lastRenderedReducer: basicStateReducer, lastRenderedState: (initialState: any)}
  action: A, // mount阶段 action 为undefined
) {
  invariant(
    numberOfReRenders < RE_RENDER_LIMIT,
    'Too many re-renders. React limits the number of renders to prevent ' +
      'an infinite loop.',
  );

  if (__DEV__) {
    warning(
      arguments.length <= 3,
      "State updates from the useState() and useReducer() Hooks don't support the " +
        'second callback argument. To execute a side effect after ' +
        'rendering, declare it in the component body with useEffect().',
    );
  }

  const alternate = fiber.alternate;
  if (
    fiber === currentlyRenderingFiber ||
    (alternate !== null && alternate === currentlyRenderingFiber)
  ) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdate = true;
    const update: Update<S, A> = {
      expirationTime: renderExpirationTime,
      action,
      eagerReducer: null,
      eagerState: null,
      next: null,
    };
    if (renderPhaseUpdates === null) {
      renderPhaseUpdates = new Map();
    }
    const firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
    if (firstRenderPhaseUpdate === undefined) {
      renderPhaseUpdates.set(queue, update);
    } else {
      // Append the update to the end of the list.
      let lastRenderPhaseUpdate = firstRenderPhaseUpdate;
      while (lastRenderPhaseUpdate.next !== null) {
        lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
      }
      lastRenderPhaseUpdate.next = update;
    }
  } else {
    flushPassiveEffects();

    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);

    const update: Update<S, A> = {
      expirationTime,
      action,
      eagerReducer: null,
      eagerState: null,
      next: null,
    };

    // Append the update to the end of the list.
    const last = queue.last;
    if (last === null) {
      // This is the first update. Create a circular list.
      update.next = update;
    } else {
      const first = last.next;
      if (first !== null) {
        // Still circular.
        update.next = first;
      }
      last.next = update;
    }
    queue.last = update;

    if (
      fiber.expirationTime === NoWork &&
      (alternate === null || alternate.expirationTime === NoWork)
    ) {
      // The queue is currently empty, which means we can eagerly compute the
      // next state before entering the render phase. If the new state is the
      // same as the current state, we may be able to bail out entirely.
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;
        if (__DEV__) {
          prevDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = InvalidNestedHooksDispatcherOnUpdateInDEV;
        }
        try {
          const currentState: S = (queue.lastRenderedState: any);
          const eagerState = lastRenderedReducer(currentState, action);
          // Stash the eagerly computed state, and the reducer used to compute
          // it, on the update object. If the reducer hasn't changed by the
          // time we enter the render phase, then the eager state can be used
          // without calling the reducer again.
          update.eagerReducer = lastRenderedReducer;
          update.eagerState = eagerState;
          if (is(eagerState, currentState)) {
            // Fast path. We can bail out without scheduling React to re-render.
            // It's still possible that we'll need to rebase this update later,
            // if the component re-renders for a different reason and by that
            // time the reducer has changed.
            return;
          }
        } catch (error) {
          // Suppress the error. It will throw again in the render phase.
        } finally {
          if (__DEV__) {
            ReactCurrentDispatcher.current = prevDispatcher;
          }
        }
      }
    }
    if (__DEV__) {
      // jest isn't a 'global', it's just exposed to tests via a wrapped function
      // further, this isn't a test file, so flow doesn't recognize the symbol. So...
      // $FlowExpectedError - because requirements don't give a damn about your type sigs.
      if ('undefined' !== typeof jest) {
        warnIfNotCurrentlyActingUpdatesInDev(fiber);
      }
    }
    scheduleWork(fiber, expirationTime);
  }
}

// 第三步，暂无

// 现在相当于初始化好了setState的hook就如同执行了一次下面的代码
const [name, setName] = useState('initialName');
// 那么，这个hook究竟是如何跟当前的函数组件或者说ui组件进行关联的呢？