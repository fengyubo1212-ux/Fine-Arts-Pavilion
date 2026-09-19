import { useRef, useCallback } from 'react';

const MAX_Y = 35;      // 横向摆动幅度（度）
const MAX_X = 25;      // 纵向摆动幅度（度）
const SCALE = 1.04;
const Z = 20;          // 抬升 translateZ（px）
const DRAG = 8;        // 触摸移动超过该像素才算"拖拽"，否则算"点按"
const FOLLOW = 'transform 0.05s linear';                             // 触摸跟随时
const SMOOTH = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';      // 鼠标/回弹

/**
 * 3D 倾斜 hook：统一鼠标 + 触摸。
 * - 鼠标：悬停跟随倾斜，移开回弹（桌面原效果）。
 * - 触摸：按住拖动照片跟着转，松手回弹；轻点不倾斜。
 * - 拖拽后自动抑制后续 click（卡片不跳转、图片不弹 lightbox），用 onClick 判断 defaultPrevented。
 * 用法：tiltRef 绑到被变换的元素；handlers 绑到接收指针事件的元素；
 *       onClick 也要传给该元素（卡片用 onClick，图片用 `onClick(e){onClick(e);if(!e.defaultPrevented) 打开lightbox}`）。
 */
export default function useTilt3D() {
  const tiltRef = useRef(null);
  const state = useRef({ active: false, startX: 0, startY: 0, dragged: false });

  const apply = useCallback((e, transition) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    el.style.transition = transition;
    el.style.transform = `perspective(600px) rotateY(${(px - 0.5) * 2 * MAX_Y}deg) rotateX(${(py - 0.5) * -2 * MAX_X}deg) scale3d(${SCALE},${SCALE},${SCALE}) translateZ(${Z}px)`;
  }, []);

  const reset = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transition = SMOOTH;
    el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1) translateZ(0)';
  }, []);

  const onPointerMove = useCallback((e) => {
    const s = state.current;
    if (e.pointerType === 'touch') {
      if (!s.active) return;
      if (!s.dragged && Math.hypot(e.clientX - s.startX, e.clientY - s.startY) < DRAG) return;
      s.dragged = true;
      apply(e, FOLLOW);
    } else {
      apply(e, SMOOTH);
    }
  }, [apply]);

  const onPointerDown = useCallback((e) => {
    if (e.pointerType !== 'touch') return;
    const s = state.current;
    s.active = true;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.dragged = false;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* 忽略旧浏览器 */ }
  }, []);

  const finish = useCallback(() => {
    const s = state.current;
    s.active = false;
    // 注意：不清 dragged，交给 onClick 消费，否则 click 时判断不到是拖拽
    reset();
  }, [reset]);

  const onPointerUp = useCallback((e) => {
    if (e.pointerType !== 'touch') return;
    finish();
  }, [finish]);

  const onPointerCancel = useCallback((e) => {
    if (e.pointerType !== 'touch') return;
    state.current.dragged = false;
    finish();
  }, [finish]);

  const onPointerLeave = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    reset();
  }, [reset]);

  const onClick = useCallback((e) => {
    if (state.current.dragged) {
      e.preventDefault();
      e.stopPropagation();
      state.current.dragged = false;
    }
  }, []);

  return { tiltRef, handlers: { onPointerMove, onPointerDown, onPointerUp, onPointerCancel, onPointerLeave }, onClick };
}
