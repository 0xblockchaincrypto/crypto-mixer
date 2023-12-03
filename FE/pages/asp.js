// Asp.js

// Asp.js
import React, { useState, useEffect } from "react";
import styles from "../style/MerkleTree.module.css";
import { sha256 } from "js-sha256";
import Link from "next/link";

const truncateHash = (hash, length = 6) => hash.substring(0, length);

const generateMerkleTree = (leafValues) => {
  // Start by creating the leaf nodes with the hash of the value
  const tree = [leafValues.map((value) => sha256(value).substring(0, 6))];
  let currentLevel = tree[0]; // Initialize currentLevel with the hashed leaf nodes

  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      // If there's a right node, use it, otherwise, hash the left one with itself
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      // Push the hash of the concatenated hashes
      nextLevel.push(sha256(left + right).substring(0, 6));
    }
    // Unshift the new level onto the tree
    tree.unshift(nextLevel);
    currentLevel = nextLevel; // Set the currentLevel to the nextLevel for the next iteration
  }

  return tree;
};

export default function Asp() {
  const [merkleTree, setMerkleTree] = useState([]);

  useEffect(() => {
    const leafValues = Array.from({ length: 5 }, () =>
      Math.random().toString()
    );
    setMerkleTree(generateMerkleTree(leafValues));
  }, []);

  return (
    <div className={styles.container}>
      <h1>Merkle Tree Visualization</h1>
      {merkleTree.map((level, idx) => (
        <div key={idx} className={styles.level}>
          {level.map((node, nodeIdx) => (
            <div key={nodeIdx} className={styles.nodeWrapper}>
              <div className={styles.node}>{node || "EMPTY"}</div>
              {idx < merkleTree.length - 1 && (
                <svg className={styles.lines} height="50" width="100%">
                  {level.map((_, childIdx) => {
                    if (childIdx % 2 === 0) {
                      const nextLevel = merkleTree[idx + 1];
                      const isPaired = childIdx < nextLevel.length * 2 - 1;
                      return (
                        <React.Fragment key={childIdx}>
                          <line
                            className={styles.line}
                            x1="50%"
                            y1="0"
                            x2={isPaired ? "25%" : "50%"}
                            y2="100%"
                            stroke="black"
                          />
                          {isPaired && (
                            <line
                              className={styles.line}
                              x1="50%"
                              y1="0"
                              x2="75%"
                              y2="100%"
                              stroke="black"
                            />
                          )}
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                </svg>
              )}
            </div>
          ))}
        </div>
      ))}
      <Link href="/">Back to Home</Link>
    </div>
  );
}
