import { SINGLE_ACTION_PROJECT_ID } from './constants';
import { Project } from './interfaces';

/* class TreeNode {
  _id: string;
  type: string;
  title: string;
  parentId: string;
  masterRank: number;
  children: TreeNode[];

  constructor(data: any) {
    this._id = data._id;
    this.type = data.type;
    this.title = data.title;
    this.parentId = data.parentId;
    this.masterRank = data.masterRank;
    this.children = [];
  }
} */

/* export interface Project {
  _id: string;
  children?: Project[];
  masterRank:number;
  parentId: string;
  title: string;
  type: "project" | "category";
} */

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

// Usage:
const data = [
  {
    "_id": SINGLE_ACTION_PROJECT_ID,
    "type": "category",
    "title": "Single Actions",
    "parentId": "unassigned",
    "masterRank": 406
  },
  {
    "_id": "1766482719",
    "type": "category",
    "title": "✈️ See the world",
    "parentId": "2f7812a9-174b-44d4-a13e-9b59dedfec97",
    "masterRank": 7
  },
  {
    "_id": "1766482720",
    "type": "project",
    "title": "See the USA",
    "parentId": "1766482719",
    "dueDate": null,
    "masterRank": 1
  },
  {
    "_id": "1766482721",
    "type": "project",
    "title": "Plan the NY sightseeing itinerary",
    "parentId": "1766482720",
    "dueDate": null,
    "masterRank": 1
  },
  {
    "_id": "1766482722",
    "type": "project",
    "title": "See new york",
    "parentId": "1766482720",
    "dueDate": null,
    "masterRank": 2
  },
  {
    "_id": "1766482723",
    "type": "project",
    "title": "See Northwest US",
    "parentId": "1766482720",
    "dueDate": null,
    "masterRank": 3
  },
  {
    "_id": "1766482724",
    "type": "project",
    "title": "Upload vacation photos",
    "parentId": "1766482723",
    "dueDate": null,
    "masterRank": 1
  }
];

const treeBuilder = new TreeBuilder();
const treeRoots = treeBuilder.buildTree(data);

// console.log(treeRoots); // Output: Array of root nodes representing the built tree structure
