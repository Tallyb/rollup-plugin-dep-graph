import { Graph } from 'graphlib';
import { Plugin } from 'rollup';

export default function printDependencyGraph(): Plugin {
  const graph = new Graph();
  
  return {
    name: 'print-dependency-graph',
    buildStart() {
      graph.nodes().forEach(node => graph.removeNode(node));
    },
    resolveId(id) {
      graph.setNode(id);
      return null;
    },
    load(id) {
      const dependencies = this.getModuleInfo(id)!.importedIds;
      dependencies.forEach(dependency => {
        graph.setEdge(id, dependency);
      });
      return null;
    },
    generateBundle(options, bundle) {
      console.log('Dependency Graph:');
      graph.nodes().forEach(node => {
        console.log(`  ${node}`);
        graph.outEdges(node)?.forEach(edge => {
          console.log(`    -> ${edge.w}`);
        });
      });
    }
  };
}
