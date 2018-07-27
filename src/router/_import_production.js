export default function(file) { return () => import('@/views/' + file + '.vue') }
