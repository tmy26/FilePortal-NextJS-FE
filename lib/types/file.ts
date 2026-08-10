const FILE_KINDS = ["ecu", "gearbox"] as const;

export type FileKind = (typeof FILE_KINDS)[number];
