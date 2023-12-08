// // Asp.js

// // Asp.js
// import React, { useState, useEffect } from "react";
// import styles from "../style/MerkleTree.module.css";
// import { sha256 } from "js-sha256";
// import Link from "next/link";
// import Merkle from "../components/apolloClient"
// const truncateHash = (hash, length = 6) => hash.substring(0, length);

// const generateMerkleTree = (leafValues) => {
//   // Start by creating the leaf nodes with the hash of the value
//   const tree = [leafValues.map((value) => sha256(value).substring(0, 6))];
//   let currentLevel = tree[0]; // Initialize currentLevel with the hashed leaf nodes

//   while (currentLevel.length > 1) {
//     const nextLevel = [];
//     for (let i = 0; i < currentLevel.length; i += 2) {
//       const left = currentLevel[i];
//       // If there's a right node, use it, otherwise, hash the left one with itself
//       const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
//       // Push the hash of the concatenated hashes
//       nextLevel.push(sha256(left + right).substring(0, 6));
//     }
//     // Unshift the new level onto the tree
//     tree.unshift(nextLevel);
//     currentLevel = nextLevel; // Set the currentLevel to the nextLevel for the next iteration
//   }

//   return tree;
// };

// export default function Asp() {
//   const [merkleTree, setMerkleTree] = useState([]);

//   useEffect(() => {
//     const leafValues = Array.from({ length: 5 }, () =>
//       Math.random().toString()
//     );
//     setMerkleTree(generateMerkleTree(leafValues));
//   }, []);

//   return (
//     <div className={styles.container}>
//       <h1>Merkle Tree Visualization</h1>
//       {merkleTree.map((level, idx) => (
//         <div key={idx} className={styles.level}>
//           {level.map((node, nodeIdx) => (
//             <div key={nodeIdx} className={styles.nodeWrapper}>
//               <div className={styles.node}>{node || "EMPTY"}</div>
//               {idx < merkleTree.length - 1 && (
//                 <svg className={styles.lines} height="50" width="100%">
//                   {level.map((_, childIdx) => {
//                     if (childIdx % 2 === 0) {
//                       const nextLevel = merkleTree[idx + 1];
//                       const isPaired = childIdx < nextLevel.length * 2 - 1;
//                       return (
//                         <React.Fragment key={childIdx}>
//                           <line
//                             className={styles.line}
//                             x1="50%"
//                             y1="0"
//                             x2={isPaired ? "25%" : "50%"}
//                             y2="100%"
//                             stroke="black"
//                           />
//                           {isPaired && (
//                             <line
//                               className={styles.line}
//                               x1="50%"
//                               y1="0"
//                               x2="75%"
//                               y2="100%"
//                               stroke="black"
//                             />
//                           )}
//                         </React.Fragment>
//                       );
//                     }
//                     return null;
//                   })}
//                 </svg>
//               )}
//             </div>
//           ))}
//         </div>
//       ))}
//       <Link href="/">Back to Home</Link>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
// import {
//   ApolloClient,
//   InMemoryCache,
//   HttpLink,
//   gql,
//   useQuery,
//   ApolloProvider,
// } from "@apollo/client";
import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";
import styles from "../style/MerkleTree.module.css";

// Apollo Client setup
// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: 'YOUR_SUBGRAPH_URL', // Replace with your subgraph URL
//   }),
//   cache: new InMemoryCache(),
// });

// // GraphQL query
// const GET_LEAF_NODES = gql`
//   query {
//     leafNodes {
//       id
//       data
//     }
//   }
// `;

// Hardcoded leaf nodes data
// const leafNodesData = [
//   [
//     { id: "1", data: "Leaf 1" },
//     { id: "2", data: "Leaf 2" },
//     { id: "3", data: "Leaf 3" },
//   ],
//   [
//     { id: "4", data: "Leaf 4" },
//     { id: "5", data: "Leaf 5" },
//     { id: "6", data: "Leaf 6" },
//   ],
//   [
//     { id: "7", data: "Leaf 7" },
//     { id: "8", data: "Leaf 8" },
//     { id: "9", data: "Leaf 9" },
//   ],
//   [
//     { id: "10", data: "Leaf 10" },
//     { id: "11", data: "Leaf 11" },
//     { id: "12", data: "Leaf 12" },
//   ],
//   [
//     { id: "13", data: "Leaf 13" },
//     { id: "14", data: "Leaf 14" },
//     { id: "15", data: "Leaf 15" },
//   ],
// ];

// // Merkle Tree utility function
// const createMerkleTree = (leafNodes) => {
//   const leaves = leafNodes.map((node) => SHA256(node.data));
//   return new MerkleTree(leaves, SHA256);
// };

// // Function to truncate hash for display
// const truncateHash = (hash) =>
//   `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;

// // React component
// function MerkleTreeComponent() {
//     // const { loading, error, data } = useQuery(GET_LEAF_NODES, {
//     //   pollInterval: 5000,
//     // });
//   const [merkleTree, setMerkleTree] = useState(null);

//   useEffect(() => {
//     const newTree = createMerkleTree(leafNodesData);
//     setMerkleTree(newTree);
//   }, []);

//   return (
//     <div className={styles.treeContainer}>
//       {merkleTree && (
//         <div className={styles.tree}>
//           {merkleTree
//             .getLayers()
//             .reverse()
//             .map((layer, index) => (
//               <div
//                 key={index}
//                 className={`${styles.layer} ${
//                   styles["layer" + (merkleTree.getLayers().length - index - 1)]
//                 }`}
//               >
//                 {layer.map((hash, hashIndex) => (
//                   <div key={hashIndex} className={styles.node}>
//                     {truncateHash(hash.toString("hex"))}
//                   </div>
//                 ))}
//               </div>
//             ))}
//         </div>
//       )}
//       {!merkleTree && (
//         <p>Merkle Tree will be displayed here once the data is available.</p>
//       )}
//     </div>
//   );
// }

// export default MerkleTreeComponent;
const leafNodesData = [
  [
    { id: "1", data: "Leaf 1" },
    { id: "2", data: "Leaf 2" },
    { id: "3", data: "Leaf 3" },
  ],
  [
    { id: "4", data: "Leaf 4" },
    { id: "5", data: "Leaf 5" },
    { id: "6", data: "Leaf 6" },
  ],
  [
    { id: "7", data: "Leaf 7" },
    { id: "8", data: "Leaf 8" },
    { id: "9", data: "Leaf 9" },
  ],
  [
    { id: "10", data: "Leaf 10" },
    { id: "11", data: "Leaf 11" },
    { id: "12", data: "Leaf 12" },
  ],
  [
    { id: "13", data: "Leaf 13" },
    { id: "14", data: "Leaf 14" },
    { id: "15", data: "Leaf 15" },
  ],
  [
    { id: "13", data: "Leaf 13" },
    { id: "14", data: "Leaf 14" },
    { id: "15", data: "Leaf 15" },
  ],
  [
    { id: "13", data: "Leaf 13" },
    { id: "14", data: "Leaf 14" },
    { id: "15", data: "Leaf 15" },
  ],
];

const createMerkleTree = (leafNodes) => {
  const leaves = leafNodes.map((node) => SHA256(node.data));
  return new MerkleTree(leaves, SHA256);
};

const truncateHash = (hash) =>
  `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;

function MerkleTreeComponent() {
  const [merkleTrees, setMerkleTrees] = useState([]);

  useEffect(() => {
    const newTrees = leafNodesData.map((nodes) => createMerkleTree(nodes));
    setMerkleTrees(newTrees);
  }, []);

  return (
    <div className={styles.gridContainer}>
      {merkleTrees.map((tree, treeIndex) => (
        <div key={treeIndex} className={styles.treeWrapper}>
          <div className={styles.tree}>
            {tree
              .getLayers()
              .reverse()
              .map((layer, index) => (
                <div key={index} className={styles.layer}>
                  {layer.map((hash, hashIndex) => (
                    <div key={hashIndex} className={styles.node}>
                      {truncateHash(hash.toString("hex"))}
                    </div>
                  ))}
                </div>
              ))}
          </div>
          <p className={styles.treeCaption}>Merkle Tree {treeIndex + 1}</p>
        </div>
      ))}
      17
    </div>
  );
}

export default MerkleTreeComponent;
