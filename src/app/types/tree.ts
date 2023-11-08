import { Project } from "./interfaces";

export class TreeBuilder {
  nodes: Map<string, Project>;

  constructor() {
    this.nodes = new Map<string, Project>();
  }

  buildTree(data: any[]): Project[] {
    for (const item of data) {
      const node = this.getNode(item._id);
      node.type = item.type;
      node.title = item.title;
      node.parentId = item.parentId;
      node.masterRank = item.masterRank;

      if (node.parentId !== "unassigned") {
        const parent = this.getNode(node.parentId);
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      }
    }

    // Find and return root nodes (nodes without a parent)
    return Array.from(this.nodes.values()).filter(node => !node.parentId);
  }

  getNode(id: string): Project {
    if (!this.nodes.has(id)) {
      const newNode = { _id: id, title: 'Projects' } as Project;
      this.nodes.set(id, newNode);
    }

    return this.nodes.get(id)!;
  }
}
