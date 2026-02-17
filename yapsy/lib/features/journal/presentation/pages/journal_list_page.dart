import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/debouncer.dart';
import '../../../../core/widgets/yapsy_empty_state.dart';
import '../../../../core/widgets/yapsy_error_state.dart';
import '../bloc/journal_list_cubit.dart';
import '../widgets/journal_card.dart';

class JournalListPage extends StatefulWidget {
  const JournalListPage({super.key});

  @override
  State<JournalListPage> createState() => _JournalListPageState();
}

class _JournalListPageState extends State<JournalListPage> {
  final _searchController = TextEditingController();
  final _debouncer = Debouncer();
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    context.read<JournalListCubit>().loadJournals();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _debouncer.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      context.read<JournalListCubit>().loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Journal'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
            child: TextField(
              controller: _searchController,
              style: AppTypography.bodySmall,
              decoration: InputDecoration(
                hintText: 'Search journals...',
                prefixIcon: const Icon(Icons.search, size: 20),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          context.read<JournalListCubit>().loadJournals(refresh: true);
                        },
                      )
                    : null,
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
              onChanged: (q) => _debouncer.call(() => context.read<JournalListCubit>().search(q)),
            ),
          ),
        ),
      ),
      body: BlocBuilder<JournalListCubit, JournalListState>(
        builder: (context, state) {
          if (state is JournalListLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state is JournalListError) {
            return YapsyErrorState(
              message: state.message,
              onRetry: () => context.read<JournalListCubit>().loadJournals(refresh: true),
            );
          }
          if (state is JournalListLoaded) {
            if (state.journals.isEmpty) {
              return const YapsyEmptyState(
                icon: Icons.book_rounded,
                title: 'No journal entries yet',
                subtitle: 'Complete a voice check-in to create your first journal entry.',
              );
            }
            return RefreshIndicator(
              onRefresh: () => context.read<JournalListCubit>().loadJournals(refresh: true),
              child: ListView.separated(
                controller: _scrollController,
                padding: const EdgeInsets.all(AppSpacing.md),
                itemCount: state.journals.length,
                separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
                itemBuilder: (_, i) {
                  final journal = state.journals[i];
                  return JournalCard(
                    journal: journal,
                    onTap: () => context.go('${RoutePaths.journal}/${journal.id}'),
                  );
                },
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }
}
