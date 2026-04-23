export interface Palette {
	name: string;
	colors: readonly [string, ...string[]];
}

export const NIX_BLUE: Palette = {
	name: "Nix Blue",
	colors: ["#7EBAE4", "#5277C3"],
};

export const NIXOS_RAINBOW: Palette = {
	name: "NixOS Rainbow",
	colors: ["#E40303", "#FF8C00", "#FFED00", "#008026", "#24408E", "#732982"],
};

export const PALETTES: readonly Palette[] = [NIX_BLUE, NIXOS_RAINBOW];
