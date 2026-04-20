import type { ActionResult } from "@/lib/action-result";

export type CatalogStatus = "available" | "sold";
export type ChangeNickStatus = "Ready" | "Not Ready";

export type CatalogRecordRow = {
  id: string;
  code: string;
  main_image_path: string;
  gallery_image_paths: string[];
  rank: string;
  price: number;
  skins: string[];
  region: string;
  change_nick_status: string;
  agent_unlock: string;
  sisa_vp: string;
  premier: string;
  status: CatalogStatus;
};

export type CatalogRecord = {
  id: string;
  code: string;
  mainImagePath: string;
  galleryImagePaths: string[];
  rank: string;
  price: number;
  skins: string[];
  region: string;
  changeNickStatus: ChangeNickStatus;
  agentUnlock: string;
  sisaVp: string;
  premier: string;
  status: CatalogStatus;
};

export type CatalogFormState = ActionResult;

export function mapCatalogRow(row: CatalogRecordRow): CatalogRecord {
  return {
    id: row.id,
    code: row.code,
    mainImagePath: row.main_image_path,
    galleryImagePaths: row.gallery_image_paths ?? [],
    rank: row.rank,
    price: row.price,
    skins: row.skins ?? [],
    region: row.region,
    changeNickStatus:
      row.change_nick_status === "Not Ready" ? "Not Ready" : "Ready",
    agentUnlock: row.agent_unlock,
    sisaVp: row.sisa_vp,
    premier: row.premier,
    status: row.status,
  };
}
