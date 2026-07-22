import { afterEach, expect, test } from "bun:test";
import { cleanup, renderHook } from "@testing-library/react";
import { useEffect } from "react";
import { useEffectEvent } from "../core/use-effect-event.js";

afterEach(cleanup);

test("effect events keep a stable identity while reading the latest callback", () => {
	const calls: string[] = [];
	const { result, rerender } = renderHook(
		({ value, prefix }: { value: string; prefix: string }) => {
			const onValue = useEffectEvent((next: string) => {
				calls.push(`${prefix}:${next}`);
			});

			useEffect(() => {
				onValue(value);
			}, [value, onValue]);

			return onValue;
		},
		{ initialProps: { value: "light", prefix: "initial" } },
	);
	const firstEvent = result.current;

	rerender({ value: "dark", prefix: "latest" });

	expect(result.current).toBe(firstEvent);
	expect(calls).toEqual(["initial:light", "latest:dark"]);
});
